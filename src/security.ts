/**
 * Security utilities for validating file paths and URLs
 */

import { promises as fs } from 'fs';
import path from 'path';
import { URL } from 'url';
import type { SecurityConfig } from './types.js';

export class SecurityValidator {
  // eslint-disable-next-line no-unused-vars
  constructor(private config: SecurityConfig) {}

  /**
   * Validates a local file path for security issues
   */
  async validateFilePath(filePath: string, workingDir?: string): Promise<void> {
    // Normalize the path to prevent directory traversal
    const normalizedPath = path.normalize(filePath);
    
    // Check for directory traversal attempts
    if (normalizedPath.includes('..') || normalizedPath.startsWith('/')) {
      throw new Error('Invalid file path: directory traversal detected');
    }

    // If working directory is specified, ensure file is within it
    if (workingDir) {
      const absoluteWorkingDir = path.resolve(workingDir);
      const absoluteFilePath = path.resolve(workingDir, normalizedPath);
      
      if (!absoluteFilePath.startsWith(absoluteWorkingDir)) {
        throw new Error('Invalid file path: file must be within working directory');
      }
    }

    // Check file extension
    const ext = path.extname(normalizedPath).toLowerCase();
    if (!this.config.allowedExtensions.includes(ext)) {
      throw new Error(`Invalid file extension: ${ext}. Allowed: ${this.config.allowedExtensions.join(', ')}`);
    }

    // Check if file exists and is readable
    try {
      const stats = await fs.stat(normalizedPath);
      if (!stats.isFile()) {
        throw new Error('Path does not point to a file');
      }

      // Check file size
      if (stats.size > this.config.maxFileSize) {
        throw new Error(`File too large: ${stats.size} bytes. Maximum: ${this.config.maxFileSize} bytes`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error('File not found');
      }
      throw error;
    }
  }

  /**
   * Validates a URL for security issues
   */
  validateUrl(urlString: string): URL {
    // Check URL length
    if (urlString.length > this.config.maxUrlLength) {
      throw new Error(`URL too long: ${urlString.length} characters. Maximum: ${this.config.maxUrlLength}`);
    }

    let url: URL;
    try {
      url = new URL(urlString);
    } catch {
      throw new Error('Invalid URL format');
    }

    // Check protocol
    if (!this.config.allowedProtocols.includes(url.protocol)) {
      throw new Error(`Invalid protocol: ${url.protocol}. Allowed: ${this.config.allowedProtocols.join(', ')}`);
    }

    // Check for blocked domains/IPs
    const hostname = url.hostname.toLowerCase();
    for (const blocked of this.config.blockedDomains) {
      if (hostname === blocked || hostname.startsWith(blocked)) {
        throw new Error(`Blocked domain: ${hostname}`);
      }
    }

    // Additional checks for private IP ranges
    if (this.isPrivateIP(hostname)) {
      throw new Error(`Private IP address not allowed: ${hostname}`);
    }

    return url;
  }

  /**
   * Checks if a hostname is a private IP address
   */
  private isPrivateIP(hostname: string): boolean {
    // IPv4 private ranges
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    
    if (match) {
      const [, a, b] = match.map(Number);

      // Check for private ranges
      if (a === 10) return true; // 10.0.0.0/8
      if (a === 172 && b !== undefined && b >= 16 && b <= 31) return true; // 172.16.0.0/12
      if (a === 192 && b === 168) return true; // 192.168.0.0/16
      if (a === 127) return true; // 127.0.0.0/8 (loopback)
      if (a === 169 && b === 254) return true; // 169.254.0.0/16 (link-local)
    }

    // IPv6 private ranges (simplified check)
    if (hostname.startsWith('::1') || hostname.startsWith('fc') || hostname.startsWith('fd')) {
      return true;
    }

    return false;
  }

  /**
   * Validates MIME type
   */
  validateMimeType(mimeType: string): void {
    if (!this.config.allowedMimeTypes.includes(mimeType)) {
      throw new Error(`Invalid MIME type: ${mimeType}. Allowed: ${this.config.allowedMimeTypes.join(', ')}`);
    }
  }
}
