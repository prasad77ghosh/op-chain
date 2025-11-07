import React, { useCallback, useRef } from "react";
import { useTreeStore } from "@/store/useNodeStore";
import { NodeItem } from "./NodeItem";
import { Loader2 } from "lucide-react";
import { api } from "@/api/node-api";
import type { Node } from "@/types";

interface Props {
  onReply: (node: Node) => void;
}

const TreeNodesSection: React.FC<Props> = ({ onReply }) => {
  const {
    selectedRoot,
    treeNodes,
    loadingTree,
    hasMoreTree,
    setLoadingTree,
    treeCursor,
    addTreeNodes,
  } = useTreeStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadMoreTreeNodes = useCallback(async () => {
    if (!treeCursor || !selectedRoot || loadingTree) return;
    setLoadingTree(true);
    try {
      const data = await api.getTree(selectedRoot._id, treeCursor);
      addTreeNodes(data.nodes, data.nextCursor, data.hasMore);
    } catch (error) {
      console.error("Error loading more tree nodes:", error);
    } finally {
      setLoadingTree(false);
    }
  }, [treeCursor, selectedRoot, loadingTree, setLoadingTree, addTreeNodes]);

  const lastNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingTree) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMoreTree) loadMoreTreeNodes();
        },
        { root: containerRef.current, threshold: 1.0 }
      );

      if (node) observer.current.observe(node);
    },
    [loadingTree, hasMoreTree, loadMoreTreeNodes]
  );

  return (
    <div ref={containerRef}>
      {treeNodes.map((node, index) => (
        <div key={node._id} ref={index === treeNodes.length - 1 ? lastNodeRef : null}>
          <NodeItem node={node} onReply={onReply} />
        </div>
      ))}

      {loadingTree && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {!hasMoreTree && treeNodes.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-4">
          No more nodes in this tree
        </div>
      )}
    </div>
  );
};

export default TreeNodesSection;
