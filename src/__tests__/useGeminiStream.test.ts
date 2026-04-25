import { renderHook, act } from '@testing-library/react';
import { useGeminiStream } from '../hooks/useGeminiStream';
import { useResultStore } from '../stores/useResultStore';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';

global.fetch = vi.fn();

describe('useGeminiStream', () => {
  beforeEach(() => {
    useResultStore.getState().reset();
    vi.clearAllMocks();
  });

  it('handles successful streaming', async () => {
    const mockChunk = JSON.stringify({ aiInsight: "insight" });
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(mockChunk));
        controller.close();
      }
    });

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      body: mockStream,
    });

    const { result } = renderHook(() => useGeminiStream());

    await act(async () => {
      await result.current.runSimulation({
        country: 'India',
        electionType: 'General',
        role: 'ECI',
        budgetSplit: { digital: 33, ground: 33, traditional: 34 },
        keyDecisions: []
      });
    });

    const state = useResultStore.getState();
    expect(state.status).toBe('success');
    expect(state.data?.aiInsight).toBe('insight');
  });

  it('handles 429 rate limit error', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 429,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useGeminiStream());

    await act(async () => {
      await result.current.runSimulation({});
    });

    const state = useResultStore.getState();
    expect(state.status).toBe('error');
    expect(state.error).toContain('API quota exhausted');
  });

  it('handles other errors', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    });

    const { result } = renderHook(() => useGeminiStream());

    await act(async () => {
      await result.current.runSimulation({});
    });

  it('handles missing stream body', async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      body: null,
    });

    const { result } = renderHook(() => useGeminiStream());

    await act(async () => {
      await result.current.runSimulation({});
    });

    const state = useResultStore.getState();
    expect(state.status).toBe('error');
    expect(state.error).toBe('No reader available');
  });

  it('handles partial json parsing with brackets', async () => {
    const mockChunk = `{"result": {"winner": "A"`;
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(mockChunk));
        controller.close();
      }
    });

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      body: mockStream,
    });

    const { result } = renderHook(() => useGeminiStream());

    await act(async () => {
      await result.current.runSimulation({});
    });

    const state = useResultStore.getState();
    // It should hit the fallback catch block and set the raw text as aiInsight
    expect(state.status).toBe('success');
  });
});
