# 🧠 Mini Mindmap

A full-stack application that transforms raw text into an interactive, node-link mindmap using AI. Built as part of the Visualli AI Challenge.

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Deepak-Solanki04/Mini-Mindmap.git
   cd Mini-Mindmap
   ```
2. Install dependencies across all monorepo workspaces:
   ```bash
   npm install
   ```

### Running the Application

#### 1. Mock Mode (Without API Key)
If you do not have a Gemini API key (or if you are on a restricted free tier with a 0-quota limit), you can run the application in Mock Mode. This bypasses the LLM and returns a structured, realistic canned response.

1. Start the backend:
   ```bash
   cd packages/backend
   # On Windows PowerShell:
   $env:MOCK_MODE="true" ; npm run dev
   # On Mac/Linux:
   MOCK_MODE=true npm run dev
   ```
2. Start the frontend (in a new terminal):
   ```bash
   cd packages/frontend
   npm run dev
   ```

#### 2. Live AI Mode
1. Navigate to `packages/backend` and create a `.env` file:
   ```env
   GEMINI_API_KEY=your_real_api_key_here
   PORT=3001
   ```
2. Start the backend: `cd packages/backend && npm run dev`
3. Start the frontend: `cd packages/frontend && npm run dev`

## 🤖 AI & LLM Provider

- **LLM Provider:** Google Gen AI (`@google/genai` SDK)
- **Model Used:** `gemini-2.0-flash`
- **Why this provider?** Google's Gemini models have excellent, natively supported `responseMimeType: 'application/json'` capabilities, making it extremely reliable for enforcing the strict Zod data contract (5-9 nodes, valid edge mappings) required by this challenge.

## ⏱️ Time Note & Tradeoffs

**Time Spent:** Roughly 12-15 hours over the course of a week, broken down into granular, step-by-step commits to ensure each vertical slice of the application was solid before moving on.

### Tradeoffs Made Under Time Pressure
- **In-Memory Storage over SQLite:** The instructions mentioned `better-sqlite3` as a nice-to-have. However, configuring `better-sqlite3` on Windows often leads to native C++ compilation errors (`node-gyp`). To guarantee that reviewers could clone and run the app flawlessly without environment headaches, I opted for a robust In-Memory `Map` store in `db.ts`. The persistence logic is entirely abstracted, so swapping to a real DB would only take a few minutes of altering the repository layer.
- **Custom Radial Math over Auto-Layout:** Instead of relying on a heavy auto-layout engine like `dagre` or `ELK`, I wrote a lightweight sine/cosine algorithm to place the root node in the center and orbit the child nodes around it. While this works beautifully for a 5-9 node limit, it would struggle with complex nested hierarchies.

### Rough Edges
- **Error Handling Granularity:** While the frontend gracefully displays the fallback error toast when the backend fails to self-heal the JSON structure, the UI does not distinguish between a Zod validation failure and a Quota Exceeded (429) error from Google in a highly customized way.

## 🔮 What I Would Improve With More Time

1. **Streaming Generation (Server-Sent Events):** Instead of making the user stare at a blocking "Generating..." spinner, I would stream the JSON chunks from Gemini and visually build the mindmap nodes one by one on the canvas in real-time.
2. **Drill-down Expansion:** Currently, clicking a node just shows a sliding summary panel. With more time, I would add a "Generate Sub-Nodes" button to the panel. Clicking it would send just that node's summary back to the LLM to recursively branch out the mindmap.
3. **Database Persistence:** I would add Prisma + PostgreSQL (or standard SQLite if the environment is strictly controlled) so that generated mindmaps survive a server restart and can be shared via URL params.
