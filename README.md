# Mini Mindmap

This is my submission for the Visualli AI Challenge. It's a full-stack application that takes a block of text and turns it into an interactive mindmap using AI.

## Setup & Installation

You need Node.js (v18+) and npm installed to run this project.

1. Clone the repository:
   ```bash
   git clone https://github.com/Deepak-Solanki04/Mini-Mindmap.git
   cd Mini-Mindmap
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

**Option 1: Mock Mode (No API Key Required)**
If you don't want to set up an API key, you can run the app in Mock Mode. It bypasses the LLM and just returns a hardcoded mindmap structure so you can test the UI.

1. Start the backend:
   ```bash
   cd packages/backend
   # On Windows PowerShell:
   $env:MOCK_MODE="true" ; npm run dev
   # On Mac/Linux:
   MOCK_MODE=true npm run dev
   ```
2. Start the frontend in a new terminal:
   ```bash
   cd packages/frontend
   npm run dev
   ```

**Option 2: Live AI Mode**
1. Go to `packages/backend` and create a `.env` file:
   ```env
   GEMINI_API_KEY=your_real_api_key_here
   PORT=3001
   ```
2. Start the backend: `cd packages/backend && npm run dev`
3. Start the frontend in a new terminal: `cd packages/frontend && npm run dev`

## AI Provider

I used Google Gen AI (the `@google/genai` SDK) with the `gemini-2.0-flash` model. I chose Gemini because it has really solid native support for JSON structured output (`responseMimeType: 'application/json'`). This made it a lot easier to enforce the strict schema requirements (like exactly 5-9 nodes and valid edges) without having to write crazy regex parsers.

## Time Note & Tradeoffs

**Time Spent:** I spent about 12-15 hours on this over the last week. I tried to build it step by step to make sure each piece was solid before moving on.

### Tradeoffs
- **In-Memory Storage vs SQLite:** The prompt mentioned SQLite was a nice-to-have, but setting up `better-sqlite3` on Windows can sometimes cause annoying native compilation errors with node-gyp. Since I wanted reviewers to be able to just clone and run it without environment issues, I went with an in-memory Map for the database. The DB logic is fully isolated though, so swapping it for a real database later would be pretty quick.
- **Custom Layout Math vs Auto-Layout Library:** Instead of using a heavy graphing library like `dagre`, I just wrote a quick math function to put the root node in the center and arrange the child nodes in a circle around it. It works perfectly for 5-9 nodes, but it definitely wouldn't scale well to massive nested graphs.

### Rough Edges
- **Error Handling:** The frontend shows a nice toast notification when the backend throws an error. However, it doesn't do a great job of explaining exactly what went wrong (e.g., distinguishing between a quota exceeded error from Google vs a validation failure). 

## What I Would Improve With More Time

1. **Streaming Generation:** Making the user wait for a loading spinner isn't the best UX. I'd love to use Server-Sent Events to stream the JSON chunks from Gemini so the mindmap nodes appear on the screen one by one.
2. **Drill-down Expansion:** Right now, clicking a node just shows the summary. It would be cool to add a "Generate More" button that sends that specific node's summary back to the LLM to generate a whole new branch of child nodes.
3. **Database:** I'd definitely add Prisma and PostgreSQL if I had more time so that users could save their mindmaps and share them via URL links.
