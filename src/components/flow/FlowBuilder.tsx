'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  MarkerType,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Shell from '@/components/ui/Shell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';

type NodeData = {
  label: string;
  audioUrl?: string;
  gather?: { maxDigits?: number; terminators?: string };
};

const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const nodeDefaults: Partial<Node<NodeData>> = { type: 'telecom' };

// ---- Pretty node body using your Card
function NodeCard({ data }: { data: NodeData }) {
  return (
    <Card className="px-3 py-2 shadow-[0_0_0_1px_rgba(16,185,129,.15)]">
      <div className="text-xs font-semibold">{data.label}</div>
      {data.audioUrl && (
        <div className="mt-1 text-[11px] text-slate-400 break-all">🎵 {data.audioUrl}</div>
      )}
      {data.gather && (
        <div className="mt-1 text-[11px] text-slate-400">
          ⌨️ {data.gather.maxDigits ?? 1} digits
          {data.gather.terminators ? ` · end: ${data.gather.terminators}` : ''}
        </div>
      )}
    </Card>
  );
}

const nodeTypes: NodeTypes = { telecom: NodeCard };

function edge(source: string, target: string): Edge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    type: 'smoothstep',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
  };
}

function allowedOutCount(label: string) {
  if (label === 'Hang Up') return 0;
  if (label === 'Play Audio') return 1;
  if (label === 'Gather DTMF') return Infinity;
  if (label === 'Answer Call') return 1;
  return 1;
}

function FlowCanvas() {
  const rf = useReactFlow<NodeData, Edge>();

  const initialNodes = useMemo<Node<NodeData>[]>(() => {
    const y = 60;
    return [
      { id: 'answer', data: { label: 'Answer Call' }, position: { x: 360, y }, ...nodeDefaults },
      { id: 'play-boot', data: { label: 'Play Audio' }, position: { x: 360, y: y + 100 }, ...nodeDefaults },
      {
        id: 'gather-boot',
        data: { label: 'Gather DTMF', gather: { maxDigits: 1, terminators: '#' } },
        position: { x: 360, y: y + 200 },
        ...nodeDefaults,
      },
      { id: 'end-boot', data: { label: 'Hang Up' }, position: { x: 360, y: y + 300 }, ...nodeDefaults },
    ];
  }, []);

  const initialEdges = useMemo<Edge[]>(
    () => [edge('answer', 'play-boot'), edge('play-boot', 'gather-boot'), edge('gather-boot', 'end-boot')],
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = nodes.find((n) => n.id === selectedId) || null;

  const onSelectionChange = useCallback((sel: { nodes: Node[] }) => {
    setSelectedId(sel.nodes?.[0]?.id ?? null);
  }, []);

  const outDegree = useCallback(
    (nodeId: string) => edges.filter((e) => e.source === nodeId).length,
    [edges]
  );

  const findTail = useCallback(() => {
    // tail = any node whose current outDegree < allowedOutCount and not "Hang Up" that is farthest down
    const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y);
    for (let i = sorted.length - 1; i >= 0; i--) {
      const n = sorted[i];
      const allowed = allowedOutCount(n.data.label);
      if (outDegree(n.id) < allowed && n.data.label !== 'Hang Up') return n;
    }
    return nodes[0]; // fallback
  }, [nodes, outDegree]);

  const connectIfValid = (srcId: string | undefined, targetId: string) => {
    if (!srcId) return false;
    const src = nodes.find((n) => n.id === srcId);
    const tgt = nodes.find((n) => n.id === targetId);
    if (!src || !tgt) return false;

    if (tgt.id === 'answer') return false; // nothing into root
    const allowed = allowedOutCount(src.data.label);
    if (outDegree(src.id) >= allowed) return false;
    if (src.id === 'end-boot' || src.data.label === 'Hang Up') return false;
    setEdges((eds) => addEdge({ ...edge(src.id, tgt.id) }, eds));
    return true;
  };

  const onConnect = useCallback(
    (c: Connection) => {
      if (!c.source || !c.target) return;
      const ok = connectIfValid(c.source, c.target);
      if (!ok) {
        // quick subtle feedback
        window?.requestAnimationFrame(() => {
          const el = document.body;
          el.animate([{ opacity: 1 }, { opacity: 0.85 }, { opacity: 1 }], { duration: 180 });
        });
      }
    },
    [connectIfValid]
  );

  // drag-swap (replacing places when dropped near)
  const onNodeDragStop = useCallback(
    (_: any, dragged: Node) => {
      const hit = nodes.find(
        (n) =>
          n.id !== dragged.id &&
          Math.abs(n.position.x - dragged.position.x) < 40 &&
          Math.abs(n.position.y - dragged.position.y) < 24
      );
      if (hit) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === hit.id
              ? { ...n, position: dragged.position }
              : n.id === dragged.id
              ? { ...n, position: hit.position }
              : n
          )
        );
      }
    },
    [nodes, setNodes]
  );

  const updateNode = (patch: Partial<NodeData>) => {
    if (!selectedId) return;
    setNodes((nds) =>
      nds.map((n) => (n.id === selectedId ? { ...n, data: { ...n.data, ...patch } } : n))
    );
  };

  const enqueueNode = (data: NodeData) => {
    const idPrefix = data.label === 'Play Audio' ? 'play-' : data.label === 'Gather DTMF' ? 'gather-' : 'end-';
    const id = idPrefix + uid().slice(0, 5);
    const pos = { x: 260 + Math.random() * 420, y: 120 + Math.random() * 360 };
    setNodes((nds) => [...nds, { id, data, position: pos, ...nodeDefaults }]);

    // auto-chain: from selection or tail
    const src = selectedId ?? findTail()?.id;
    setTimeout(() => connectIfValid(src, id), 0);
  };

  const addPlay = () => enqueueNode({ label: 'Play Audio' });
  const addGather = () => enqueueNode({ label: 'Gather DTMF', gather: { maxDigits: 1, terminators: '#' } });
  const addEnd = () => enqueueNode({ label: 'Hang Up' });

  // audio modal
  const [openAudio, setOpenAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const attachAudio = () => {
    updateNode({ audioUrl: audioUrl.trim() || undefined });
    setOpenAudio(false);
    setAudioUrl('');
  };
  const onPickFile = (f: File) => setAudioUrl(URL.createObjectURL(f));

  // save/load/json
  const onSave = () => localStorage.setItem('flow:v1', JSON.stringify(rf.toObject()));
  const onLoad = () => {
    const raw = localStorage.getItem('flow:v1');
    if (!raw) return;
    const obj = JSON.parse(raw);
    rf.setViewport(obj.viewport);
    setNodes(obj.nodes ?? []);
    setEdges(obj.edges ?? []);
  };

  return (
    <Shell
      title="Call Flow Builder"
      actions={
        <div className="flex gap-2">
          <Button onClick={onSave}>Save</Button>
          <Button variant="secondary" onClick={onLoad}>
            Load
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(JSON.stringify(rf.toObject(), null, 2))}
          >
            Copy JSON
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-[250px_1fr_340px] gap-4">
        {/* Palette */}
        <Card className="p-3 bg-gradient-to-b from-slate-900/40 to-slate-900/10">
          <div className="space-y-2">
            <Button onClick={addPlay} className="w-full transition-transform hover:scale-[1.02]">
              + Play Audio
            </Button>
            <Button onClick={addGather} className="w-full transition-transform hover:scale-[1.02]">
              + Gather DTMF
            </Button>
            <Button onClick={addEnd} className="w-full transition-transform hover:scale-[1.02]">
              + End
            </Button>
            <div className="text-[11px] text-slate-500">
              Drag nodes; connect by dragging handles. Zoom with controls.
            </div>
          </div>
        </Card>

        {/* Canvas */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 shadow-[0_0_60px_-30px_rgba(16,185,129,.45)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onSelectionChange={onSelectionChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap pannable zoomable
              position="bottom-left"
              style={{ background: 'transparent', width: 160, height: 110 }}
              className="!pointer-events-auto"
            />
            <Controls position="left-bottom" />
            <Background gap={24} size={1} />
          </ReactFlow>
        </Card>

        {/* Inspector */}
        <Card className="p-4 bg-slate-950/60">
          <div className="text-sm font-semibold mb-3">Inspector</div>

          {!selected ? (
            <div className="text-xs text-slate-500">Select a node to edit.</div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={selected.data.label}
                  onChange={(e: any) => updateNode({ label: e.target.value })}
                />
              </div>

              {selected.id.startsWith('play-') && (
                <>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setOpenAudio(true)}>
                      Attach audio
                    </Button>
                    <div className="text-[11px] text-slate-500 truncate">
                      {selected.data.audioUrl ? `🎵 ${selected.data.audioUrl}` : 'No audio'}
                    </div>
                  </div>
                </>
              )}

              {selected.id.startsWith('gather-') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Max digits</Label>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={selected.data.gather?.maxDigits ?? 1}
                      onChange={(e: any) =>
                        updateNode({
                          gather: {
                            ...(selected.data.gather ?? {}),
                            maxDigits: Number(e.target.value || 1),
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Terminators</Label>
                    <Input
                      placeholder="#*0"
                      value={selected.data.gather?.terminators ?? '#'}
                      onChange={(e: any) =>
                        updateNode({
                          gather: {
                            ...(selected.data.gather ?? {}),
                            terminators: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Audio modal */}
      {openAudio && selected && selected.id.startsWith('play-') && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <Card className="w-[520px] p-5">
            <div className="text-sm font-semibold mb-4">Attach audio</div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Audio URL</Label>
                <Input
                  placeholder="https://…/prompt.wav or .mp3"
                  value={audioUrl}
                  onChange={(e: any) => setAudioUrl(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs">
                  <input
                    type="file"
                    accept=".mp3,.wav,.ogg"
                    onChange={(e) => e.target.files?.[0] && onPickFile(e.target.files[0])}
                    className="hidden"
                    id="audio-file"
                  />
                  <span className="inline-block">
                    <Button variant="secondary" onClick={() => document.getElementById('audio-file')?.click()}>
                      Upload file
                    </Button>
                  </span>
                </label>
                <div className="text-[11px] text-slate-500">mp3 / wav / ogg</div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={() => setOpenAudio(false)}>
                  Cancel
                </Button>
                <Button onClick={attachAudio}>Attach</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Shell>
  );
}

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}
