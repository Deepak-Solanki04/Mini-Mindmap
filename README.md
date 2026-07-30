# Mini Mindmap

A full-stack monorepo application that transforms any text into an interactive, node-link mindmap using Google Gen AI structured JSON generation.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
1. Clone the repository: `git clone https://github.com/Deepak-Solanki04/Mini-Mindmap.git`
2. Navigate to the root directory and install dependencies across all workspaces:
   ```bash
   npm install
   ```

### Environment Configuration
Navigate to `packages/backend` and create a `.env` file (if you haven't already):
```env
# Google Gemini Gen AI Key
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### Running the Application (Mock Mode)
To run the application without an LLM API key, you can use Mock Mode. This returns a realistic canned response.

1. Start the backend in mock mode:
   ```bash
   cd packages/backend
   $env:MOCK_MODE="true"
   npm run dev
   ```
2. Start the frontend:
   ```bash
   cd packages/frontend
   npm run dev
   ```

### Running the Application (Live Mode)
1. Ensure your `GEMINI_API_KEY` is set in `packages/backend/.env`.
2. Start backend: `cd packages/backend && npm run dev`
3. Start frontend: `cd packages/frontend && npm run dev`

## 🛠️ Tech Stack
- **Monorepo**: npm workspaces
- **Frontend**: React (Vite), TypeScript, TailwindCSS, `@xyflow/react` (ReactFlow)
- **Backend**: Node.js, Express, TypeScript, Zod (schema validation), `@google/genai`
- **Testing**: Vitest + React Testing Library (Frontend), Jest + Supertest (Backend)

For detailed architectural decisions and constraints handling, please see [architecture_guide.md](./architecture_guide.md).
