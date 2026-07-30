# Mini Mindmap: Architecture & Implementation Guide

This document serves as a comprehensive reference to explain the architectural choices, tradeoffs, and logic implemented in this project. 

## 1. Monorepo Architecture
The project was structured as a monorepo using npm workspaces (`packages/backend` and `packages/frontend`).
**Why?**
This tightly couples the frontend and backend, allowing us to easily share the strict TypeScript interfaces (`Mindmap`, `MindmapNode`, `MindmapConnection`) between the UI and the API. If the data contract changes in the backend, the frontend will immediately throw a compilation error, preventing broken data pipelines in production.

## 2. Strict AI Data Contract
The core problem of this challenge is turning unstructured LLM output into a deterministic JSON format.

### Zod Validation
We used `zod` to define exact schemas in the backend. 
- The schema strictly enforces limits, such as requiring exactly 5 to 9 nodes.
- Every node must have a `label` (1-4 words) and a `summary` (1 sentence).

### Domain Constraints & Self-Healing (1-Retry Fallback)
Beyond basic type checking, the `ai.ts` service manually validates graph integrity:
1. `rootId` must exist in the array of nodes.
2. Every `from` and `to` field in `connections` must match an existing node `id`. This prevents dangling edges (a common hallucination in LLMs).

If the LLM violates *any* of these rules, the backend does not immediately fail. Instead, it enters a **self-healing loop**:
- It catches the validation error message.
- It re-prompts the LLM with the exact error (e.g., `"The previous JSON failed validation... rootId does not match any node id."`) and asks it to try again.
- It runs this retry exactly once before gracefully failing.

## 3. Storage Layer Tradeoff
The instructions permitted using `better-sqlite3`. However, `better-sqlite3` requires native C++ compilation via `node-gyp`, which frequently fails on Windows environments lacking Visual Studio Build Tools.
To guarantee a flawless review experience without compilation headaches, we implemented a robust **In-Memory Map** in `src/db.ts`. 
Because the DB logic is fully abstracted behind simple getter/setter functions, swapping this Map out for SQLite or PostgreSQL in the future would only take 10 minutes without altering a single Express route.

## 4. Visualizing the Graph
We leveraged `@xyflow/react` (ReactFlow) to render the mindmap instead of building a custom SVG renderer from scratch.
- **Layout Math**: Instead of relying on a complex auto-layout engine like ELK or Dagre, we wrote a lightweight radial algorithm. The root node is placed at the center (400, 300), and child nodes are distributed evenly in a circular orbit using `Math.cos()` and `Math.sin()`.
- **Aesthetic**: We utilized a modern "glassmorphism" aesthetic with Tailwind CSS, utilizing `backdrop-blur` and semi-transparent backgrounds to give the application a premium feel.

## 5. Testing Strategy
- **Backend**: We used `jest` to mock the Google Gen AI API, allowing us to thoroughly test the fallback/retry logic and the Express endpoints without spending API tokens.
- **Frontend**: We used `vitest` and `@testing-library/react` to verify that the application correctly handles loading states, enforces the 20-character limit on the textarea, and gracefully displays error messages when the generation fails.
