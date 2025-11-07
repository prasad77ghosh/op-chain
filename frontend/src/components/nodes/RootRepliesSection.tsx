import React, { useCallback, useEffect, useRef } from "react";
import { useTreeStore } from "@/store/useNodeStore";
import { NodeItem } from "./NodeItem";
import { Loader2 } from "lucide-react";
import { api } from "@/api/node-api";
import type { Node, Root } from "@/types";

interface Props {
  onReply: (node: Node | Root) => void;
}

const RootRepliesSection: React.FC<Props> = ({ onReply }) => {
  const {
    selectedRoot,
    nodeReplies,
    hasMoreReplies,
    loadingReplies,
    repliesCursors,
  } = useTreeStore();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  const rootId = selectedRoot?._id;
  const replies = rootId ? nodeReplies[rootId] || [] : [];
  const hasMore = rootId ? hasMoreReplies[rootId] : false;
  const loading = rootId ? loadingReplies[rootId] : false;
  const cursor = rootId ? repliesCursors[rootId] : null;

  /** Load initial replies */
  const loadReplies = useCallback(async () => {
    if (!selectedRoot || loadingRef.current) return;
    
    loadingRef.current = true;
    useTreeStore.getState().setLoadingReplies(selectedRoot._id, true);
    
    try {
      const data = await api.getReplies(selectedRoot._id, undefined, 10);
      
      useTreeStore.getState().setNodeReplies(
        selectedRoot._id,
        data.replies, // Backend already returns oldest → newest
        data.nextCursor,
        data.hasMore
      );
    } catch (error) {
      console.error("Error loading replies:", error);
    } finally {
      loadingRef.current = false;
      useTreeStore.getState().setLoadingReplies(selectedRoot._id, false);
    }
  }, [selectedRoot?._id]);

  /** Load more replies (infinite scroll) */
  const loadMoreReplies = useCallback(async () => {
    if (!selectedRoot || !hasMore || loadingRef.current || !cursor) return;
    
    loadingRef.current = true;
    useTreeStore.getState().setLoadingReplies(selectedRoot._id, true);
    
    try {
      const data = await api.getReplies(selectedRoot._id, cursor, 10);
      
      useTreeStore.getState().addNodeReplies(
        selectedRoot._id,
        data.replies, // Backend already returns oldest → newest
        data.nextCursor,
        data.hasMore
      );
    } catch (error) {
      console.error("Error loading more replies:", error);
    } finally {
      loadingRef.current = false;
      useTreeStore.getState().setLoadingReplies(selectedRoot._id, false);
    }
  }, [selectedRoot?._id, hasMore, cursor]);

  /** Infinite scroll observer */
  const lastReplyRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingRef.current) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
            loadMoreReplies();
          }
        },
        { 
          root: containerRef.current, 
          threshold: 0.8,
          rootMargin: '100px'
        }
      );

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMoreReplies]
  );

  /** Initial load */
  useEffect(() => {
    const rootIdValue = selectedRoot?._id;
    if (rootIdValue && !nodeReplies[rootIdValue] && !loadingRef.current) {
      loadReplies();
    }
  }, [selectedRoot?._id, loadReplies]);

  /** Cleanup observer */
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (!selectedRoot) return null;

  return (
    <div ref={containerRef} className="space-y-2">
      {loading && replies.length === 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {replies.length > 0 && (
        <>
          {replies.map((reply, index) => (
            <div
              key={reply._id}
              ref={index === replies.length - 1 ? lastReplyRef : null}
            >
              <NodeItem node={reply} onReply={onReply} depth={1} />
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {!hasMore && !loading && (
            <div className="text-center text-sm text-gray-500 py-4">
              No more replies
            </div>
          )}
        </>
      )}

      {!loading && replies.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-4">
          No replies yet
        </div>
      )}
    </div>
  );
};

export default RootRepliesSection;