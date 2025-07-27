/**
 * Type definitions for the MCP PDF Server
 */

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  keywords?: string;
  pages?: number;
}

export interface PDFTextResult {
  text: string;
  pages: number;
  metadata?: PDFMetadata;
}

export interface PDFPageText {
  page: number;
  text: string;
}

export interface PDFExtractionOptions {
  startPage?: number;
  endPage?: number;
  includeMetadata?: boolean;
  maxFileSize?: number; // in bytes
  timeout?: number; // in milliseconds
}

export interface PDFProcessingResult {
  success: boolean;
  data?: {
    text?: string;
    pageTexts?: PDFPageText[];
    metadata?: PDFMetadata;
    pageCount?: number;
  };
  error?: string;
  source: string; // file path or URL
}

export interface SecurityConfig {
  maxFileSize: number; // 50MB default
  allowedExtensions: string[];
  allowedMimeTypes: string[];
  downloadTimeout: number; // 30 seconds default
  allowedProtocols: string[];
  blockedDomains: string[];
  maxUrlLength: number;
}

export interface ServerConfig {
  name: string;
  version: string;
  security: SecurityConfig;
  workingDirectory?: string;
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  allowedExtensions: ['.pdf'],
  allowedMimeTypes: ['application/pdf'],
  downloadTimeout: 30000, // 30 seconds
  allowedProtocols: ['http:', 'https:'],
  blockedDomains: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '10.',
    '172.16.',
    '192.168.'
  ],
  maxUrlLength: 2048
};

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  name: 'mcp-pdf-server',
  version: '1.0.0',
  security: DEFAULT_SECURITY_CONFIG
};
