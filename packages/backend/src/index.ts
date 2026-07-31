import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import { generateMindmap } from './ai';
import { saveMindmap, getMindmapsList, getMindmapById } from './db';

const app = express();
app.use(cors());
app.use(express.json());

const GenerateRequestSchema = z.object({
  text: z.string().min(20, "Input text must be at least 20 characters long")
});

app.post('/api/mindmaps', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = GenerateRequestSchema.parse(req.body);
    const mindmap = await generateMindmap(text);
    const storedMindmap = saveMindmap(mindmap);
    res.status(201).json(storedMindmap);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: (error as any).errors[0].message });
      return;
    }
    console.error("Error generating mindmap:", error);
    res.status(500).json({ error: error.message || "Failed to generate mindmap" });
  }
});

app.get('/api/mindmaps', (req: Request, res: Response) => {
  res.json(getMindmapsList());
});

app.get('/api/mindmaps/:id', (req: Request, res: Response): void => {
  const mindmap = getMindmapById(req.params.id as string);
  if (!mindmap) {
    res.status(404).json({ error: "Mindmap not found" });
    return;
  }
  res.json(mindmap);
});

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
