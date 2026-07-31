import React from 'react';
import { X, Info } from 'lucide-react';
import type { MindmapNode } from '../types';

interface NodeSummaryProps {
  node: MindmapNode | null;
  onClose: () => void;
}

const NodeSummary: React.FC<NodeSummaryProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-80 glass z-20 flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0 border-l border-white/20">
      <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-2 text-slate-100">
          <Info className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-lg">Node Details</h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-1">Label</h4>
          <p className="text-slate-100 font-medium text-lg">{node.label}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-1">Summary</h4>
          <p className="text-slate-300 leading-relaxed text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            {node.summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NodeSummary;
