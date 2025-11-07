import type { Root } from "@/types";
import { User, Plus } from "lucide-react";
// import { Button } from "../ui/button";
// import { useTreeStore } from "@/store/useNodeStore";
// import { api } from "@/api/node-api";

export const RootNodeCard = ({
  rootNode,
  handleReply,
}: {
  rootNode: Root;
  handleReply: (node: Root) => void;
}) => {
  // const { setLoadingTree, setTreeData } = useTreeStore();

  // const loadTree = async (rootId: string) => {
  //   setLoadingTree(true);
  //   try {
  //     const data = await api.getTree(rootId);
  //     setTreeData(data.rootNode, data.nodes, data.nextCursor, data.hasMore);
  //   } catch (error) {
  //     console.error("Error loading tree:", error);
  //   } finally {
  //     setLoadingTree(false);
  //   }
  // };
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg p-6">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-40 pointer-events-none" />

      <div className="relative flex flex-col gap-4">
        {/* Header — Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium opacity-90">
              {rootNode.author?.name || "Unknown"}
            </span>
          </div>

          <span className="text-xs opacity-70">
            {new Date(rootNode.createdAt).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Result */}
        <div className="flex flex-col">
          <span className="text-xs opacity-75 uppercase tracking-wider">
            Result
          </span>
          <span className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-sm">
            {rootNode.result}
          </span>
        </div>

        {/* Reply Button */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => handleReply(rootNode)}
            className="
              bg-white 
              text-blue-600 
              px-5 py-2.5 
              rounded-lg 
              hover:bg-blue-50 
              transition-all 
              duration-200 
              font-medium 
              flex items-center justify-center gap-2 
              shadow-sm hover:shadow-md
            "
          >
            <Plus className="w-4 h-4" />
            Add Reply
          </button>

          {/* <Button
            className="cursor-pointer"
            onClick={() => loadTree(rootNode._id)}
          >
            show full tree
          </Button> */}
        </div>
      </div>
    </div>
  );
};
