import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Mindmap, MindmapNode as AppNode } from '../types';

interface MindmapGraphProps {
  mindmap: Mindmap | null;
  onNodeSelect: (node: AppNode | null) => void;
}

const MindmapGraph: React.FC<MindmapGraphProps> = ({ mindmap, onNodeSelect }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Convert our Mindmap JSON to ReactFlow nodes/edges
  useMemo(() => {
    if (!mindmap) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Separate root and children for radial layout
    const rootNode = mindmap.nodes.find(n => n.id === mindmap.rootId);
    const childNodes = mindmap.nodes.filter(n => n.id !== mindmap.rootId);

    if (rootNode) {
      newNodes.push({
        id: rootNode.id,
        position: { x: 400, y: 300 },
        data: { label: rootNode.label },
        style: {
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '16px',
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)',
        }
      });
    }

    // Radial layout for children
    const radius = 250;
    const angleStep = (2 * Math.PI) / childNodes.length;
    
    childNodes.forEach((child, i) => {
      const angle = i * angleStep;
      newNodes.push({
        id: child.id,
        position: {
          x: 400 + radius * Math.cos(angle),
          y: 300 + radius * Math.sin(angle)
        },
        data: { label: child.label },
        style: {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '12px',
          backdropFilter: 'blur(5px)',
        }
      });
    });

    mindmap.connections.forEach((conn, i) => {
      newEdges.push({
        id: `e${i}-${conn.from}-${conn.to}`,
        source: conn.from,
        target: conn.to,
        label: conn.label,
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        labelStyle: { fill: '#94a3b8', fontWeight: 500 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#94a3b8',
        },
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [mindmap, setNodes, setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    if (!mindmap) return;
    const found = mindmap.nodes.find(n => n.id === node.id) || null;
    onNodeSelect(found);
  }, [mindmap, onNodeSelect]);

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  if (!mindmap) return null;

  return (
    <div className="w-full h-full absolute inset-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        colorMode="dark"
      >
        <Controls />
        <MiniMap nodeStrokeColor="#fff" nodeColor="rgba(255,255,255,0.1)" maskColor="rgba(0,0,0,0.2)" />
        <Background color="#334155" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default MindmapGraph;
