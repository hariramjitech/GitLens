import React, { useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  ControlButton
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useGitHub } from "../hooks/useGitHub";
import CommitNode from "./CommitNode";
import { GitBranch, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Maximize2, Minus, Plus } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const nodeTypes = {
  commitNode: CommitNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 160, ranksep: 140 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 320, height: 140 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 150,
        y: nodeWithPosition.y - 60,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const CommitGraphContent = ({ owner, repo, onSelectCommit }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fetchBranches, fetchCommits, loading, error } = useGitHub();
  const { setViewport, fitView } = useReactFlow();

  const loadData = useCallback(async () => {
    if (!owner || !repo) return;

    try {
      const branchData = await fetchBranches(owner, repo);
      if (branchData.length > 0) {
        const defaultBranch = branchData.find(b => b.name === 'main' || b.name === 'master') || branchData[0];
        const commitData = await fetchCommits(owner, repo, defaultBranch.name);
        processCommits(commitData);
      }
    } catch (err) {
      console.error(err);
    }
  }, [owner, repo, fetchBranches, fetchCommits]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const processCommits = (commitData) => {
    const rawNodes = commitData.map((commit, i) => ({
      id: commit.sha,
      type: "commitNode",
      data: {
        sha: commit.sha.substring(0, 7),
        fullSha: commit.sha,
        message: commit.commit.message.split("\n")[0] || "No message",
        author: commit.commit.author?.name || "Unknown Author",
        avatarUrl: commit.author?.avatar_url,
        date: commit.commit.author?.date,
        isHead: i === 0,
      },
      position: { x: 0, y: 0 },
    }));

    const rawEdges = [];
    commitData.forEach((commit) => {
      commit.parents.forEach((parent) => {
        if (commitData.some(c => c.sha === parent.sha)) {
          rawEdges.push({
            id: `e-${parent.sha}-${commit.sha}`,
            source: parent.sha,
            target: commit.sha,
            type: "smoothstep",
            animated: false,
            style: { stroke: "#27272a", strokeWidth: 2 },
          });
        }
      });
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    // Center on HEAD (first node) after a short delay to ensure rendering
    if (layoutedNodes.length > 0) {
      setTimeout(() => {
        setViewport({ x: window.innerWidth / 2 - 400, y: 100, zoom: 0.85 }, { duration: 1000 });
      }, 100);
    }
  };

  if (!owner || !repo) return null;

  return (
    <div className="w-full h-full bg-black relative flex flex-col overflow-hidden font-inter border-none">
      <div className="flex-1">
        {error && !nodes.length ? (
          <div className="absolute inset-0 flex items-center justify-center p-8 z-50">
            <div className="bg-zinc-950 p-10 rounded-3xl border border-red-500/10 text-center max-w-sm shadow-2xl">
              <AlertCircle className="w-8 h-8 text-red-500/40 mx-auto mb-6" />
              <h3 className="text-sm font-semibold mb-2 text-zinc-100 uppercase tracking-widest">Protocol Interrupted</h3>
              <p className="text-zinc-500 text-[11px] mb-8 font-medium leading-relaxed uppercase tracking-tight">{error}</p>
              <button 
                onClick={loadData}
                className="btn-primary w-full"
              >
                Reconnect
              </button>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => onSelectCommit(node.data)}
            minZoom={0.01}
            maxZoom={1.5}
            colorMode="dark"
            panOnScroll={true}
            zoomOnScroll={true}
            zoomActivationKey="Alt"
            zoomOnPinch={true}
            panOnDrag={true}
            selectionOnDrag={false}
            className="selection:bg-zinc-800"
          >
            <Background gap={40} size={0.5} color="rgba(255,255,255,0.03)" variant="dots" />
            <Controls showInteractive={false} position="bottom-right" showZoom={false}>
               <ControlButton onClick={() => setViewport({ x: window.innerWidth / 2 - 400, y: 100, zoom: 0.85 }, { duration: 800 })} title="Center on HEAD">
                  <GitBranch className="w-4 h-4" />
               </ControlButton>
               <ControlButton onClick={() => fitView({ padding: 0.2, duration: 800 })} title="Overview">
                  <Maximize2 className="w-4 h-4" />
               </ControlButton>
               <div className="h-4 w-px bg-zinc-800 mx-1" />
               <ControlButton onClick={() => setViewport(undefined, { duration: 400, zoom: (v) => v.zoom * 1.5 })} title="Zoom In">
                  <Plus className="w-4 h-4" />
               </ControlButton>
               <ControlButton onClick={() => setViewport(undefined, { duration: 400, zoom: (v) => v.zoom / 1.5 })} title="Zoom Out">
                  <Minus className="w-4 h-4" />
               </ControlButton>
            </Controls>
            <MiniMap 
              position="bottom-left"
              nodeStrokeWidth={3}
              zoomable
              pannable
              maskColor="rgba(0,0,0,0.8)"
              nodeColor="rgba(255,255,255,0.05)"
              nodeBorderRadius={8}
            />
          </ReactFlow>
        )}
      </div>

      {loading && !nodes.length && (
         <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="space-y-4 text-center">
               <div className="w-8 h-8 border-2 border-zinc-900 border-t-zinc-400 rounded-full animate-spin mx-auto"></div>
               <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Synthesizing Architecture...</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default function CommitGraph(props) {
  return (
    <ReactFlowProvider>
      <CommitGraphContent {...props} />
    </ReactFlowProvider>
  );
}
