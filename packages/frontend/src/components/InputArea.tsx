import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface InputAreaProps {
  onGenerate: (text: string) => Promise<void>;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length >= 20) {
      onGenerate(text);
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-10 px-4">
      <form onSubmit={handleSubmit} className="glass p-4 flex flex-col gap-3">
        <textarea
          className="w-full bg-slate-900/50 text-slate-100 placeholder-slate-400 border border-slate-700/50 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
          placeholder="Paste an article, ideas, or unstructured notes here to generate a mindmap... (min 20 characters)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {text.length} characters (min 20 required)
          </span>
          <button
            type="submit"
            disabled={isLoading || text.trim().length < 20}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Generating...' : 'Generate Mindmap'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputArea;
