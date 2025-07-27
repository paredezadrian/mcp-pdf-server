/**
 * MCP PDF Server implementation
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { PDFProcessor } from './pdf-processor.js';
import type { ServerConfig, PDFExtractionOptions } from './types.js';
import { DEFAULT_SERVER_CONFIG } from './types.js';

export class MCPPDFServer {
  private server: McpServer;
  private pdfProcessor: PDFProcessor;
  private config: ServerConfig;

  constructor(config: Partial<ServerConfig> = {}) {
    this.config = { ...DEFAULT_SERVER_CONFIG, ...config };
    
    this.server = new McpServer({
      name: this.config.name,
      version: this.config.version
    });

    this.pdfProcessor = new PDFProcessor(
      this.config.security,
      this.config.workingDirectory
    );

    this.setupTools();
  }

  private setupTools(): void {
    // Tool: Extract text from PDF
    this.server.registerTool(
      'extract-text',
      {
        title: 'Extract Text from PDF',
        description: 'Extract text content from a PDF file (local path or URL)',
        inputSchema: {
          source: z.string().describe('PDF file path or URL'),
          startPage: z.number().optional().describe('Start page number (1-based)'),
          endPage: z.number().optional().describe('End page number (1-based)'),
          maxFileSize: z.number().optional().describe('Maximum file size in bytes'),
          timeout: z.number().optional().describe('Timeout for URL downloads in milliseconds')
        }
      },
      async ({ source, startPage, endPage, maxFileSize, timeout }) => {
        const options: PDFExtractionOptions = {};
        if (startPage !== undefined) options.startPage = startPage;
        if (endPage !== undefined) options.endPage = endPage;
        if (maxFileSize !== undefined) options.maxFileSize = maxFileSize;
        if (timeout !== undefined) options.timeout = timeout;

        const result = this.isUrl(source)
          ? await this.pdfProcessor.processUrl(source, options)
          : await this.pdfProcessor.processLocalFile(source, options);

        if (!result.success) {
          return {
            content: [{
              type: 'text',
              text: `Error: ${result.error}`
            }],
            isError: true
          };
        }

        const textContent = result.data?.text || 
          result.data?.pageTexts?.map(pt => `Page ${pt.page}:\n${pt.text}`).join('\n\n') || 
          'No text extracted';

        return {
          content: [{
            type: 'text',
            text: textContent
          }]
        };
      }
    );

    // Tool: Extract metadata from PDF
    this.server.registerTool(
      'extract-metadata',
      {
        title: 'Extract PDF Metadata',
        description: 'Extract metadata information from a PDF file',
        inputSchema: {
          source: z.string().describe('PDF file path or URL'),
          maxFileSize: z.number().optional().describe('Maximum file size in bytes'),
          timeout: z.number().optional().describe('Timeout for URL downloads in milliseconds')
        }
      },
      async ({ source, maxFileSize, timeout }) => {
        const options: PDFExtractionOptions = {
          includeMetadata: true
        };
        if (maxFileSize !== undefined) options.maxFileSize = maxFileSize;
        if (timeout !== undefined) options.timeout = timeout;

        const result = this.isUrl(source)
          ? await this.pdfProcessor.processUrl(source, options)
          : await this.pdfProcessor.processLocalFile(source, options);

        if (!result.success) {
          return {
            content: [{
              type: 'text',
              text: `Error: ${result.error}`
            }],
            isError: true
          };
        }

        const metadata = result.data?.metadata;
        if (!metadata) {
          return {
            content: [{
              type: 'text',
              text: 'No metadata found in PDF'
            }]
          };
        }

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(metadata, null, 2)
          }]
        };
      }
    );

    // Tool: Get page count
    this.server.registerTool(
      'get-page-count',
      {
        title: 'Get PDF Page Count',
        description: 'Get the total number of pages in a PDF file',
        inputSchema: {
          source: z.string().describe('PDF file path or URL'),
          maxFileSize: z.number().optional().describe('Maximum file size in bytes'),
          timeout: z.number().optional().describe('Timeout for URL downloads in milliseconds')
        }
      },
      async ({ source, maxFileSize, timeout }) => {
        const options: PDFExtractionOptions = {};
        if (maxFileSize !== undefined) options.maxFileSize = maxFileSize;
        if (timeout !== undefined) options.timeout = timeout;

        const result = this.isUrl(source)
          ? await this.pdfProcessor.processUrl(source, options)
          : await this.pdfProcessor.processLocalFile(source, options);

        if (!result.success) {
          return {
            content: [{
              type: 'text',
              text: `Error: ${result.error}`
            }],
            isError: true
          };
        }

        const pageCount = result.data?.pageCount || 0;
        return {
          content: [{
            type: 'text',
            text: `Total pages: ${pageCount}`
          }]
        };
      }
    );

    // Tool: Extract all information (text, metadata, page count)
    this.server.registerTool(
      'extract-all',
      {
        title: 'Extract All PDF Information',
        description: 'Extract text, metadata, and page count from a PDF file in one operation',
        inputSchema: {
          source: z.string().describe('PDF file path or URL'),
          startPage: z.number().optional().describe('Start page number (1-based)'),
          endPage: z.number().optional().describe('End page number (1-based)'),
          maxFileSize: z.number().optional().describe('Maximum file size in bytes'),
          timeout: z.number().optional().describe('Timeout for URL downloads in milliseconds')
        }
      },
      async ({ source, startPage, endPage, maxFileSize, timeout }) => {
        const options: PDFExtractionOptions = {
          includeMetadata: true
        };
        if (startPage !== undefined) options.startPage = startPage;
        if (endPage !== undefined) options.endPage = endPage;
        if (maxFileSize !== undefined) options.maxFileSize = maxFileSize;
        if (timeout !== undefined) options.timeout = timeout;

        const result = this.isUrl(source)
          ? await this.pdfProcessor.processUrl(source, options)
          : await this.pdfProcessor.processLocalFile(source, options);

        if (!result.success) {
          return {
            content: [{
              type: 'text',
              text: `Error: ${result.error}`
            }],
            isError: true
          };
        }

        const response = {
          source: result.source,
          pageCount: result.data?.pageCount || 0,
          metadata: result.data?.metadata || null,
          text: result.data?.text || null,
          pageTexts: result.data?.pageTexts || null
        };

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response, null, 2)
          }]
        };
      }
    );
  }

  private isUrl(source: string): boolean {
    try {
      new URL(source);
      return true;
    } catch {
      return false;
    }
  }

  getServer(): McpServer {
    return this.server;
  }
}
