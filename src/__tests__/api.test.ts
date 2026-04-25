import { describe, it, expect, vi } from 'vitest';
import { POST as simulatePOST } from '@/app/api/simulate/route';
import { NextRequest } from 'next/server';

describe('API Routes Validation', () => {
  it('simulate API rejects invalid payload', async () => {
    const invalidPayload = { country: 'India' }; // Missing electionType, budgetSplit
    const req = new NextRequest('http://localhost/api/simulate', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
    });

    const res = await simulatePOST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid payload');
  });

  it('simulate API accepts valid payload', async () => {
    // We need to mock generateSimpleAIResponseStream to avoid actual AI calls
    vi.mock('@/lib/vertex-ai', () => ({
      generateSimpleAIResponseStream: vi.fn().mockResolvedValue(new ReadableStream()),
      generateAIResponseStream: vi.fn().mockResolvedValue(new ReadableStream()),
    }));

    const validPayload = {
      country: 'India',
      electionType: 'General Election',
      budgetSplit: { digital: 40, ground: 40, traditional: 20 }
    };
    const req = new NextRequest('http://localhost/api/simulate', {
      method: 'POST',
      body: JSON.stringify(validPayload),
    });

    const res = await simulatePOST(req);
    expect(res.status).toBe(200);
  });
});
