import React, { useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { useGitHub } from "../hooks/useGitHub";
import CommitNode from "./CommitNode";
import { GitBranch, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const nodeTypes = {
  commitNode: CommitNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 140, ranksep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 300, height: 120 });
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

export default function CommitGraph({ owner, repo, onSelectCommit }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fetchBranches, fetchCommits, loading, error } = useGitHub();

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
            style: { stroke: "rgba(255, 255, 255, 0.08)", strokeWidth: 1.5 },
          });
        }
      });
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  };

  if (!owner || !repo) return null;

  return (
    <div className="w-full h-full bg-black relative flex flex-col overflow-hidden font-inter border-none">
      <div className="flex-1">
        {error && !nodes.length ? (
          <div className="absolute inset-0 flex items-center justify-center p-8 z-50">
            <div className="bg-[#050505] p-10 rounded-3xl border border-red-500/10 text-center max-w-sm shadow-2xl">
              <AlertCircle className="w-8 h-8 text-red-500/40 mx-auto mb-6" />
              <h3 className="text-sm font-semibold mb-2 text-white/80 uppercase tracking-widest">Protocol Interrupted</h3>
              <p className="text-white/20 text-[11px] mb-8 font-medium leading-relaxed uppercase tracking-tight">{error}</p>
              <button 
                onClick={loadData}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all border border-white/5"
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
            fitView
            fitViewOptions={{ padding: 0.3 }}
            minZoom={0.05}
            maxZoom={2}
            colorMode="dark"
            panOnScroll={true}
            selectionOnDrag={true}
            className="selection:bg-white/10"
          >
            <Background gap={40} size={0.5} color="rgba(255,255,255,0.03)" variant="dots" />
            <Controls showInteractive={false} position="bottom-right" className="!bg-[#050505] !border-white/5 !shadow-2xl !rounded-xl overflow-hidden" />
            <MiniMap 
              position="bottom-left"
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="!bg-[#050505]/80 !border-white/5 !rounded-2xl !backdrop-blur-3xl"
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
               <div className="w-8 h-8 border-2 border-white/5 border-t-white/40 rounded-full animate-spin mx-auto"></div>
               <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Synthesizing Architecture...</p>
            </div>
         </div>
      )}
    </div>
  );
}
