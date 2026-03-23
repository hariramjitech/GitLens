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
import { GitBranch, AlertCircle, RefreshCw } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const nodeTypes = {
  commitNode: CommitNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 120, ranksep: 100 });

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
        x: nodeWithPosition.x - 160,
        y: nodeWithPosition.y - 70,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function CommitGraph({ owner, repo, onSelectCommit }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const { fetchBranches, fetchCommits, loading, error } = useGitHub();

  const loadData = useCallback(async () => {
    if (!owner || !repo) return;

    try {
      const branchData = await fetchBranches(owner, repo);
      setBranches(branchData);
      
      if (branchData.length > 0) {
        // Find main or master, else first
        const defaultBranch = branchData.find(b => b.name === 'main' || b.name === 'master') || branchData[0];
        setSelectedBranch(defaultBranch.name);
        
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

  useEffect(() => {
    if (selectedBranch && owner && repo) {
      const reloadCommits = async () => {
        try {
          const commitData = await fetchCommits(owner, repo, selectedBranch);
          processCommits(commitData);
        } catch (err) {
          console.error(err);
        }
      };
      reloadCommits();
    }
  }, [selectedBranch, owner, repo, fetchCommits]);

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
        // Only draw edges to nodes we actually have in our list
        if (commitData.some(c => c.sha === parent.sha)) {
          rawEdges.push({
            id: `e-${parent.sha}-${commit.sha}`,
            source: parent.sha,
            target: commit.sha,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2, opacity: 0.6 },
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
    <div className="w-full h-full bg-slate-50 relative flex flex-col overflow-hidden">
      {/* Search & Branch Selector Overlays */}
      <div className="absolute top-6 left-6 z-10 flex items-center space-x-4">
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl flex items-center space-x-3 shadow-sm border border-slate-200/60">
          <GitBranch className="w-4 h-4 text-indigo-500" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent text-sm font-bold text-gray-200 focus:outline-none cursor-pointer pr-4"
            disabled={loading && branches.length === 0}
          >
            {branches.map(b => (
              <option key={b.name} value={b.name} className="bg-gray-900">{b.name}</option>
            ))}
          </select>
        </div>

        {loading && !nodes.length && (
          <div className="glass px-4 py-2 rounded-2xl flex items-center space-x-2 animate-pulse">
            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Updating Graph</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        {error && !nodes.length ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="glass p-8 rounded-3xl border-red-500/20 text-center max-w-md">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Failed to load graph</h3>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <button 
                onClick={loadData}
                className="btn-primary py-2 px-6 text-sm"
              >
                Try Again
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
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={1.5}
            colorMode="dark"
          >
            <Background gap={32} size={1} color="rgba(255,255,255,0.03)" />
            <Controls showInteractive={false} position="bottom-right" />
            <MiniMap 
              position="bottom-left"
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          </ReactFlow>
        )}
      </div>

      {loading && !nodes.length && (
        <LoadingSpinner fullScreen message="Synthesizing commit graph..." />
      )}
    </div>
  );
}
