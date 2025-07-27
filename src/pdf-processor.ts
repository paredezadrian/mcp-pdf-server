/**
 * PDF processing utilities using pdf-parse
 */

import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { lookup } from 'mime-types';
import type { 
  PDFProcessingResult, 
  PDFExtractionOptions, 
  PDFMetadata,
  PDFPageText,
  SecurityConfig 
} from './types.js';
import { SecurityValidator } from './security.js';

export class PDFProcessor {
  private securityValidator: SecurityValidator;

  constructor(
    private securityConfig: SecurityConfig,
    // eslint-disable-next-line no-unused-vars
    private workingDirectory?: string
  ) {
    this.securityValidator = new SecurityValidator(securityConfig);
  }

  /**
   * Process a PDF from a local file path
   */
  async processLocalFile(
    filePath: string, 
    options: PDFExtractionOptions = {}
  ): Promise<PDFProcessingResult> {
    try {
      // Validate file path
      await this.securityValidator.validateFilePath(filePath, this.workingDirectory);

      // Resolve full path
      const fullPath = this.workingDirectory 
        ? path.resolve(this.workingDirectory, filePath)
        : path.resolve(filePath);

      // Read file
      const buffer = await fs.readFile(fullPath);
      
      // Process PDF
      return await this.processPDFBuffer(buffer, filePath, options);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error processing local file',
        source: filePath
      };
    }
  }

  /**
   * Process a PDF from a URL
   */
  async processUrl(
    urlString: string, 
    options: PDFExtractionOptions = {}
  ): Promise<PDFProcessingResult> {
    try {
      // Validate URL
      const url = this.securityValidator.validateUrl(urlString);

      // Download with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options.timeout || this.securityConfig.downloadTimeout);

      try {
        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: {
            'User-Agent': 'MCP-PDF-Server/1.0.0'
          }
        });

        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check content type
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/pdf')) {
          // Try to infer from URL extension as fallback
          const urlPath = url.pathname;
          const mimeType = lookup(urlPath) || '';
          if (mimeType !== 'application/pdf') {
            throw new Error(`Invalid content type: ${contentType}. Expected application/pdf`);
          }
        }

        // Check content length
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > this.securityConfig.maxFileSize) {
          throw new Error(`File too large: ${contentLength} bytes. Maximum: ${this.securityConfig.maxFileSize} bytes`);
        }

        // Get buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Double-check size after download
        if (buffer.length > this.securityConfig.maxFileSize) {
          throw new Error(`File too large: ${buffer.length} bytes. Maximum: ${this.securityConfig.maxFileSize} bytes`);
        }

        return await this.processPDFBuffer(buffer, urlString, options);
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error processing URL',
        source: urlString
      };
    }
  }

  /**
   * Process PDF buffer with pdf-parse
   */
  private async processPDFBuffer(
    buffer: Buffer,
    source: string,
    options: PDFExtractionOptions
  ): Promise<PDFProcessingResult> {
    try {
      // Dynamic import for pdf-parse to avoid module loading issues
      const pdfParse = (await import('pdf-parse')).default;

      // Parse PDF
      const pdfData = await pdfParse(buffer);

      const result: PDFProcessingResult = {
        success: true,
        source,
        data: {}
      };

      // Extract full text if no page range specified
      if (!options.startPage && !options.endPage) {
        result.data!.text = pdfData.text;
      }

      // Extract page count
      result.data!.pageCount = pdfData.numpages;

      // Extract metadata if requested
      if (options.includeMetadata && pdfData.info) {
        result.data!.metadata = this.extractMetadata(pdfData.info);
      }

      // Extract specific pages if requested
      if (options.startPage || options.endPage) {
        result.data!.pageTexts = await this.extractPageTexts(
          buffer, 
          options.startPage || 1, 
          options.endPage || pdfData.numpages
        );
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error parsing PDF',
        source
      };
    }
  }

  /**
   * Extract metadata from PDF info object
   */
  private extractMetadata(info: Record<string, unknown>): PDFMetadata {
    const metadata: PDFMetadata = {};

    if (info['Title']) metadata.title = String(info['Title']);
    if (info['Author']) metadata.author = String(info['Author']);
    if (info['Subject']) metadata.subject = String(info['Subject']);
    if (info['Creator']) metadata.creator = String(info['Creator']);
    if (info['Producer']) metadata.producer = String(info['Producer']);
    if (info['Keywords']) metadata.keywords = String(info['Keywords']);

    // Handle dates
    if (info['CreationDate']) {
      try {
        metadata.creationDate = new Date(info['CreationDate'] as string);
      } catch {
        // Ignore invalid dates
      }
    }

    if (info['ModDate']) {
      try {
        metadata.modificationDate = new Date(info['ModDate'] as string);
      } catch {
        // Ignore invalid dates
      }
    }

    return metadata;
  }

  /**
   * Extract text from specific page range
   * Note: pdf-parse doesn't support page-specific extraction natively,
   * so this is a simplified implementation that extracts all text
   * and attempts to split by pages (not perfect but functional)
   */
  private async extractPageTexts(
    buffer: Buffer, 
    startPage: number, 
    endPage: number
  ): Promise<PDFPageText[]> {
    // This is a simplified implementation
    // For more accurate page-by-page extraction, consider using pdf2pic + OCR
    // or a more advanced PDF library like pdf-lib

    // Dynamic import for pdf-parse
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(buffer);
    const totalPages = pdfData.numpages;
    
    // Validate page range
    const validStartPage = Math.max(1, Math.min(startPage, totalPages));
    const validEndPage = Math.max(validStartPage, Math.min(endPage, totalPages));
    
    // Simple text splitting (not accurate but functional)
    const allText = pdfData.text;
    const textPerPage = Math.ceil(allText.length / totalPages);
    
    const pageTexts: PDFPageText[] = [];
    
    for (let page = validStartPage; page <= validEndPage; page++) {
      const startIndex = (page - 1) * textPerPage;
      const endIndex = Math.min(page * textPerPage, allText.length);
      const pageText = allText.substring(startIndex, endIndex);
      
      pageTexts.push({
        page,
        text: pageText
      });
    }
    
    return pageTexts;
  }
}
