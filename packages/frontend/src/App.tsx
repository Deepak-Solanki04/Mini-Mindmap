import React, { useState } from 'react';
import axios from 'axios';
import InputArea from './components/InputArea';
import MindmapGraph from './components/MindmapGraph';
import NodeSummary from './components/NodeSummary';
import { Mindmap, MindmapNode } from './types';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function App() {
  const [mindmap, setMindmap] = useState<Mindmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindmapNode | null>(null);

  const handleGenerate = async (text: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedNode(null);
    try {
      const response = await axios.post<Mindmap>(`${API_URL}/mindmaps`, { text });
      setMindmap(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'An unexpected error occurred while generating the mindmap.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900 relative text-slate-100 flex flex-col">
      <header className="absolute top-0 w-full p-6 z-20 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tight text-white/90 drop-shadow-md">
          Mini Mindmap
        </h1>
      </header>

      <InputArea onGenerate={handleGenerate} isLoading={isLoading} />
      
      {error && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-lg max-w-2xl w-full backdrop-blur-md">
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      <div className="flex-grow relative">
        <MindmapGraph mindmap={mindmap} onNodeSelect={setSelectedNode} />
      </div>

      <NodeSummary node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
}

export default App;
