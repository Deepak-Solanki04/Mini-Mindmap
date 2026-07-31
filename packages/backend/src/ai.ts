import { GoogleGenAI } from '@google/genai';
import { Mindmap, MindmapSchema } from './types';

export const generateMindmap = async (text: string, isRetry: boolean = false, previousError: string = ""): Promise<Mindmap> => {
  if (!text || text.trim() === '') {
    throw new Error('Input text is empty');
  }
  if (text.trim().length < 20) {
    throw new Error('Input text is too short to summarize meaningfully');
  }

  if (process.env.MOCK_MODE === 'true') {
    return {
      title: 'Mock Mindmap',
      rootId: '1',
      nodes: [
        { id: '1', label: 'Root Node', summary: 'This is the main topic.' },
        { id: '2', label: 'Child 1', summary: 'This is the first child.' },
        { id: '3', label: 'Child 2', summary: 'This is the second child.' },
        { id: '4', label: 'Child 3', summary: 'This is the third child.' },
        { id: '5', label: 'Child 4', summary: 'This is the fourth child.' },
      ],
      connections: [
        { from: '1', to: '2', label: 'has part' },
        { from: '1', to: '3', label: 'has part' },
        { from: '1', to: '4', label: 'has part' },
        { from: '1', to: '5', label: 'has part' },
      ],
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  let prompt = `Analyze the following text and generate a structured mindmap.
You must return ONLY valid JSON matching the exact schema requested.
The mindmap must have exactly 5 to 9 nodes (including root).
rootId must match one of the node IDs.
Every 'from' and 'to' in connections must match a real node ID (no dangling edges).
Node IDs must be unique.
Label: 1-4 words. Summary: one sentence.

Text to analyze:
${text}
`;

  if (isRetry) {
    prompt = `The previous JSON you generated failed validation with the following error:
${previousError}

Please correct the JSON and return the fixed version based on the original text:
${text}
`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const rawText = response.text || "{}";
    const parsedJson = JSON.parse(rawText);
    const validatedMindmap = MindmapSchema.parse(parsedJson);
    
    const nodeIds = new Set(validatedMindmap.nodes.map(n => n.id));
    if (!nodeIds.has(validatedMindmap.rootId)) {
      throw new Error("rootId does not match any node id.");
    }
    for (const conn of validatedMindmap.connections) {
      if (!nodeIds.has(conn.from)) {
        throw new Error(`Connection from-id '${conn.from}' does not exist.`);
      }
      if (!nodeIds.has(conn.to)) {
        throw new Error(`Connection to-id '${conn.to}' does not exist.`);
      }
    }

    return validatedMindmap;
  } catch (error: any) {
    if (!isRetry) {
      console.warn("Validation or Generation failed, retrying once...", error.message);
      return generateMindmap(text, true, error.message);
    }
    throw new Error(`Failed to generate valid mindmap after retry: ${error.message}`);
  }
};
