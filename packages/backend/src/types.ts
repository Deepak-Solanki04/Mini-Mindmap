import { z } from 'zod';

export const MindmapNodeSchema = z.object({
  id: z.string().describe('stable and unique within the mindmap'),
  label: z.string().describe('1-4 words'),
  summary: z.string().describe('one sentence')
});

export const MindmapConnectionSchema = z.object({
  from: z.string().describe('node id'),
  to: z.string().describe('node id'),
  label: z.string().describe('relationship label, e.g. "causes" or "part of"')
});

export const MindmapSchema = z.object({
  title: z.string(),
  rootId: z.string().describe("must match one node's id"),
  nodes: z.array(MindmapNodeSchema).min(5).max(9).describe('5-9 nodes total, including the root'),
  connections: z.array(MindmapConnectionSchema)
});

export type MindmapNode = z.infer<typeof MindmapNodeSchema>;
export type MindmapConnection = z.infer<typeof MindmapConnectionSchema>;
export type Mindmap = z.infer<typeof MindmapSchema>;

// Additional types for DB storage
export type StoredMindmap = Mindmap & { id: string; createdAt: string };
