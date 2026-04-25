import { describe, it, expect } from 'vitest';
import { cn, safeJsonParse } from '../lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
      expect(cn('bg-red-500', { 'text-white': true, 'hidden': false })).toBe('bg-red-500 text-white');
    });
  });

  describe('safeJsonParse', () => {
    it('should parse JSON response successfully', async () => {
      const mockResponse = new Response(JSON.stringify({ data: 'test' }), {
        headers: { 'content-type': 'application/json' }
      });
      const result = await safeJsonParse(mockResponse);
      expect(result).toEqual({ data: 'test' });
    });

    it('should throw an error for non-JSON response', async () => {
      const mockResponse = new Response('<html>Error</html>', {
        headers: { 'content-type': 'text/html' }
      });
      await expect(safeJsonParse(mockResponse)).rejects.toThrow(/Expected JSON/);
    });

    it('should throw an error when content-type is missing', async () => {
      const mockResponse = new Response('just text', {
        headers: {}
      });
      await expect(safeJsonParse(mockResponse)).rejects.toThrow(/Expected JSON/);
    });
  });
});
