import { api } from "@/api/node-api";
import { useAuthStore } from "@/store/useAuthStore";
import { useTreeStore } from "@/store/useNodeStore";
import type { Node } from "@/types";
import { ChevronRight, Loader2, Plus, User } from "lucide-react";

export const NodeItem = ({
  node,
  onReply,
  depth = 0,
}: {
  node: Node;
  onReply: (node: Node) => void;
  depth?: number;
}) => {
  const {
    expandedNodes,
    toggleNode,
    nodeReplies,
    hasMoreReplies,
    loadingReplies,
  } = useTreeStore();

  const { user } = useAuthStore();

  const isExpanded = expandedNodes.has(node._id);
  const replies = nodeReplies[node._id] || [];
  const hasMore = hasMoreReplies[node._id];
  const isLoading = loadingReplies[node._id];

  const handleToggleReplies = async () => {
    if (isExpanded) {
      toggleNode(node._id);
      return;
    }

    toggleNode(node._id); // Expand first

    if (replies.length === 0) {
      useTreeStore.getState().setLoadingReplies(node._id, true);
      try {
        const data = await api.getReplies(node._id);
        useTreeStore
          .getState()
          .setNodeReplies(
            node._id,
            data.replies,
            data.nextCursor,
            data.hasMore
          );
      } catch (error) {
        console.error("Error loading replies:", error);
      } finally {
        useTreeStore.getState().setLoadingReplies(node._id, false);
      }
    }
  };

  const loadMoreReplies = async () => {
    const cursor = useTreeStore.getState().repliesCursors[node._id];
    if (!hasMore || isLoading || !cursor) return;

    useTreeStore.getState().setLoadingReplies(node._id, true);
    try {
      const data = await api.getReplies(node._id, cursor);
      useTreeStore
        .getState()
        .addNodeReplies(node._id, data.replies, data.nextCursor, data.hasMore);
    } catch (error) {
      console.error("Error loading more replies:", error);
    } finally {
      useTreeStore.getState().setLoadingReplies(node._id, false);
    }
  };

  const getOperationColor = (op: string) => {
    switch (op) {
      case "+":
        return "text-green-600 bg-green-50";
      case "-":
        return "text-red-600 bg-red-50";
      case "*":
        return "text-blue-600 bg-blue-50";
      case "/":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="mb-2" style={{ marginLeft: `${depth * 20}px` }}>
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {node.authorId?.name || "Unknown"}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(node.createdAt).toLocaleString()}
          </span>
        </div>

        {node.operation && (
          <div className="mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
              <span
                className={`px-2 py-1 rounded ${getOperationColor(
                  node.operation
                )}`}
              >
                {node.leftValue} {node.operation} {node.rightValue}
              </span>
              <span className="text-gray-400">=</span>
              <span className="font-bold text-gray-800">{node.result}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleToggleReplies}
            className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1"
          >
            <ChevronRight
              className={`w-3 h-3 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
            Replies
          </button>

          {user && user._id && (
            <button
              onClick={() => onReply(node)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Reply
            </button>
          )}
        </div>
      </div>

      {/* Replies Section */}
      {isExpanded && (
        <div className="mt-2">
          {isLoading && replies.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {replies.map((reply) => (
                <NodeItem
                  key={reply._id}
                  node={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}

              {/* Load more replies button */}
              {hasMore && (
                <div className="mt-2 ml-4">
                  <button
                    onClick={loadMoreReplies}
                    disabled={isLoading}
                    className="text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load more replies"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
