import React from "react";
import { RootNodeCard } from "./SelectedNode";
import { useTreeStore } from "@/store/useNodeStore";
import type { Node, ReplyParent, Root } from "@/types";
import TreeNodesSection from "./NodeTreeSecion";
import RootRepliesSection from "./RootRepliesSection";

interface RightBarProps {
  setShowCreateReply: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyParent: React.Dispatch<React.SetStateAction<ReplyParent>>;
}
const RightBar = ({
  setReplyParent,
  setShowCreateReply,
}:RightBarProps) => {
  const { selectedRoot, treeNodes } = useTreeStore();

  const handleReply = (node: Node | Root) => {
    setReplyParent(node);
    setShowCreateReply(true);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
      {selectedRoot && (
        <RootNodeCard rootNode={selectedRoot} handleReply={handleReply} />
      )}

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {treeNodes.length > 0 ? (
          <TreeNodesSection onReply={handleReply} />
        ) : (
          <RootRepliesSection onReply={handleReply} />
        )}
      </div>
    </div>
  );
};

export default RightBar;
