'use client';
import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, Background, Controls, MiniMap, Connection, Edge, Node, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

type Flow = { id: string; name: string; nodes: Node[]; edges: Edge[] };

const Shell: React.FC<{ title: string; extra?: React.ReactNode; children: React.ReactNode }> = ({ title, extra, children }) => (
  <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
        <div className="flex gap-3">{extra}</div>
      </div>
      <div className="rounded-3xl border border-emerald-500/20 bg-slate-950/80 p-4 shadow-xl shadow-emerald-500/10 backdrop-blur">
        {children}
      </div>
    </div>
  </div>
);

const NodeBox = ({ label }: { label: string }) => (
  <div className="rounded-xl border border-emerald-400/30 bg-slate-950 px-4 py-3 text-slate-100 shadow-md shadow-black/40">
    <div className="text-sm font-semibold">{label}</div>
  </div>
);

const nodeTypes = {
  start: () => <NodeBox label="Start" />,
  audio: () => <NodeBox label="Play Audio" />,
  gather: () => <NodeBox label="Gather DTMF" />,
  end: () => <NodeBox label="End" />,
};

const initialNodes: Node[] = [
  { id: 'start', position: { x: 200, y: 20 }, data: {}, type: 'start' },
  { id: 'a1', position: { x: 200, y: 140 }, data: {}, type: 'audio' },
  { id: 'g1', position: { x: 200, y: 260 }, data: {}, type: 'gather' },
  { id: 'a2', position: { x: 200, y: 380 }, data: {}, type: 'audio' },
  { id: 'end', position: { x: 200, y: 500 }, data: {}, type: 'end' }
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'start', target: 'a1' },
  { id: 'e2', source: 'a1', target: 'g1' },
  { id: 'e3', source: 'g1', target: 'a2', label: 'DTMF 1' },
  { id: 'e4', source: 'a2', target: 'end' }
];

export default function Page() {
  const [name, setName] = useState('Support Flow');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((c: Connection) => setEdges((eds) => addEdge(c, eds)), []);

  async function save() {
    const body: Flow = { id: Date.now().toString(), name, nodes, edges };
    const res = await fetch('/api/flows', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) alert('Flow saved!');
  }

  return (
    <Shell
      title="Call Flow Builder"
      extra={
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" />
          <button onClick={save} className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-900">Save</button>
          <a href="/(telecom)/calls" className="rounded-lg border border-emerald-400/40 px-4 py-2 text-emerald-300">Send Calls</a>
        </>
      }
    >
      <div style={{ height: '70vh' }} className="overflow-hidden rounded-2xl">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </Shell>
  );
}
