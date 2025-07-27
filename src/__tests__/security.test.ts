/**
 * Tests for security validation
 */

import { SecurityValidator } from '../security';
import { DEFAULT_SECURITY_CONFIG } from '../types';

describe('SecurityValidator', () => {
  let validator: SecurityValidator;

  beforeEach(() => {
    validator = new SecurityValidator(DEFAULT_SECURITY_CONFIG);
  });

  describe('validateUrl', () => {
    it('should accept valid HTTPS URLs', () => {
      expect(() => {
        validator.validateUrl('https://example.com/document.pdf');
      }).not.toThrow();
    });

    it('should accept valid HTTP URLs', () => {
      expect(() => {
        validator.validateUrl('http://example.com/document.pdf');
      }).not.toThrow();
    });

    it('should reject invalid protocols', () => {
      expect(() => {
        validator.validateUrl('ftp://example.com/document.pdf');
      }).toThrow('Invalid protocol');
    });

    it('should reject localhost URLs', () => {
      expect(() => {
        validator.validateUrl('http://localhost/document.pdf');
      }).toThrow('Blocked domain');
    });

    it('should reject private IP addresses', () => {
      expect(() => {
        validator.validateUrl('http://192.168.1.1/document.pdf');
      }).toThrow('Blocked domain');

      expect(() => {
        validator.validateUrl('http://10.0.0.1/document.pdf');
      }).toThrow('Blocked domain');

      expect(() => {
        validator.validateUrl('http://172.16.0.1/document.pdf');
      }).toThrow('Blocked domain');
    });

    it('should reject URLs that are too long', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(3000);
      expect(() => {
        validator.validateUrl(longUrl);
      }).toThrow('URL too long');
    });

    it('should reject malformed URLs', () => {
      expect(() => {
        validator.validateUrl('not-a-url');
      }).toThrow('Invalid URL format');
    });
  });

  describe('validateMimeType', () => {
    it('should accept PDF mime type', () => {
      expect(() => {
        validator.validateMimeType('application/pdf');
      }).not.toThrow();
    });

    it('should reject non-PDF mime types', () => {
      expect(() => {
        validator.validateMimeType('text/plain');
      }).toThrow('Invalid MIME type');

      expect(() => {
        validator.validateMimeType('image/jpeg');
      }).toThrow('Invalid MIME type');
    });
  });

  describe('private IP detection', () => {
    it('should detect various private IP ranges', () => {
      const testCases = [
        '127.0.0.1',
        '10.0.0.1',
        '172.16.0.1',
        '192.168.1.1',
        '169.254.1.1'
      ];

      testCases.forEach(ip => {
        expect(() => {
          validator.validateUrl(`http://${ip}/test.pdf`);
        }).toThrow();
      });
    });

    it('should allow public IP addresses', () => {
      const testCases = [
        '8.8.8.8',
        '1.1.1.1',
        '208.67.222.222'
      ];

      testCases.forEach(ip => {
        expect(() => {
          validator.validateUrl(`http://${ip}/test.pdf`);
        }).not.toThrow();
      });
    });
  });
});
