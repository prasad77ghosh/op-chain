import type { Root } from "@/types";
import { MessageSquare, User } from "lucide-react";

export const RootCard = ({
  root,
  onClick,
}: {
  root: Root;
  onClick: (rootId: Root) => void;
}) => {
  return (
    <div
      onClick={() => onClick(root)}
      className="
        group relative bg-white 
        border border-gray-200 
        rounded-sm
        p-5 
        hover:shadow-lg 
        hover:border-blue-200 
        transition-all 
        duration-200 
        cursor-pointer
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {root.author?.name || "Anonymous"}
          </span>
        </div>

        <div className="text-xs text-gray-400">
          {new Date(root.createdAt).toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Result Section */}
      <div className="mb-4">
        <p className="text-[2.25rem] leading-none font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
          {root.result}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="font-medium">
            {root.replyCount} {root.replyCount === 1 ? "reply" : "replies"}
          </span>
        </div>

        {root._id && (
          <span className="text-xs text-gray-400 italic">
            Root ID: {root._id.slice(0, 6)}…
          </span>
        )}
      </div>

      {/* Hover Accent */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-b-xl" />
    </div>
  );
};
