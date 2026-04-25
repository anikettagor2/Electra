import { useResultStore } from '@/stores/useResultStore';

export const useGeminiStream = () => {
  const { setPartialData, setStatus, setError } = useResultStore();

  const runSimulation = async (payload: any) => {
    setStatus('loading');
    setPartialData({});
    try {
      // Call our local Next.js API route which proxies to Gemini
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Simulation failed.' }));
        const is429 = response.status === 429;
        const msg = is429
          ? '⏳ API quota exhausted. All available models are rate-limited. Please wait 1–2 minutes and try again.'
          : errorData.error || 'Failed to start simulation.';
        throw new Error(msg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Try to parse the partial JSON
        // We look for common keys and extract their values if they are closed with quotes/brackets
        // Extract AI Insight more reliably
        const insightMatch = accumulatedText.match(/"aiInsight":\s*"([^"]*)"?/);
        if (insightMatch && insightMatch[1]) {
          setPartialData({ aiInsight: insightMatch[1] });
        }

        // Try to find the most complete JSON block
        const jsonBlocks = accumulatedText.match(/{[\s\S]*}/g);
        if (jsonBlocks) {
          const latestBlock = jsonBlocks[jsonBlocks.length - 1];
          try {
            const parsed = JSON.parse(latestBlock);
            setPartialData(parsed);
          } catch (e) {
            // If full parse fails, try to close common structures
            try {
              const fixed = latestBlock + '"}';
              const parsedFixed = JSON.parse(fixed);
              setPartialData(parsedFixed);
            } catch (e2) {
              try {
                const fixed2 = latestBlock + ']}';
                const parsedFixed2 = JSON.parse(fixed2);
                setPartialData(parsedFixed2);
              } catch (e3) {}
            }
          }
        }
      }

      // Final attempt to parse the entire response
      try {
        // Clean up any potential markdown or garbage
        const jsonStart = accumulatedText.indexOf('{');
        const jsonEnd = accumulatedText.lastIndexOf('}') + 1;
        const finalJson = accumulatedText.slice(jsonStart, jsonEnd);
        const finalData = JSON.parse(finalJson);
        setPartialData(finalData);
        setStatus('success');
      } catch (e) {
        console.error("Final parse failed:", e);
        // Fallback: If it's just raw text, put it in aiInsight
        if (accumulatedText.length > 50) {
          setPartialData({ aiInsight: accumulatedText });
          setStatus('success');
        } else {
          throw new Error('Received malformed response from simulation engine');
        }
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
    }
  };

  return { runSimulation };
};
