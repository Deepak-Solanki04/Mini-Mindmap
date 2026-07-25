import { generateMindmap } from './ai';

// Simple mock for GoogleGenAI
jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: JSON.stringify({
              title: 'Mock Title',
              rootId: '1',
              nodes: [
                { id: '1', label: 'Root', summary: 'Root node' },
                { id: '2', label: 'Child 1', summary: 'Child 1' },
                { id: '3', label: 'Child 2', summary: 'Child 2' },
                { id: '4', label: 'Child 3', summary: 'Child 3' },
                { id: '5', label: 'Child 4', summary: 'Child 4' }
              ],
              connections: [
                { from: '1', to: '2', label: 'link' },
                { from: '1', to: '3', label: 'link' },
                { from: '1', to: '4', label: 'link' },
                { from: '1', to: '5', label: 'link' }
              ]
            })
          })
        }
      };
    })
  };
});

describe('AI logic', () => {
  beforeEach(() => {
    process.env.MOCK_MODE = 'false';
    process.env.GEMINI_API_KEY = 'test_key';
  });

  it('throws error for empty input', async () => {
    await expect(generateMindmap('')).rejects.toThrow('Input text is empty');
  });

  it('throws error for short input', async () => {
    await expect(generateMindmap('too short')).rejects.toThrow('Input text is too short');
  });

  it('returns mock data in mock mode', async () => {
    process.env.MOCK_MODE = 'true';
    const result = await generateMindmap('this is a sufficiently long string for the test to pass');
    expect(result.title).toBe('Mock Mindmap');
    expect(result.nodes).toHaveLength(5);
  });
});
