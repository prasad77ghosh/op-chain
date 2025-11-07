import type { Root } from "@/types";
import { Loader2, TrendingUp } from "lucide-react";
import { RootCard } from "./RootCard";
import { useTreeStore } from "@/store/useNodeStore";
import { api } from "@/api/node-api";
import { useCallback, useRef } from "react";

const LeftBar = ({ roots }: { roots: Root[] }) => {
  const {
    rootsCursor,
    hasMoreRoots,
    addRoots,
    reset,
    setSelectedRoot,
    loadingRoots,
    setLoadingRoots,
  } = useTreeStore();

  
  const select_root = async (root: Root) => {
    reset();
    setSelectedRoot(root);
  };

  
  const loadMoreRoots = async () => {
    if (!rootsCursor || loadingRoots) return;

    setLoadingRoots(true);
    try {
      const data = await api.getRoots(rootsCursor);
      addRoots(
        data.roots,
        data.pagination.nextCursor,
        data.pagination.hasNextPage
      );
    } catch (error) {
      console.error("Error loading more roots:", error);
    } finally {
      setLoadingRoots(false);
    }
  };

  
  const rootsObserver = useRef<IntersectionObserver | null>(null);

  const lastRootRef = useCallback(
    (node: HTMLElement | null) => {
      if (loadingRoots) return;

      if (rootsObserver.current) rootsObserver.current.disconnect();

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreRoots) {
          loadMoreRoots();
        }
      });

      if (node) observer.observe(node);

      rootsObserver.current = observer;

      return () => observer.disconnect();
    },
    [loadingRoots, hasMoreRoots]
  );

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Discussions</h2>
        </div>

        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {roots.map((root, index) => (
            <div
              key={root._id}
              ref={index === roots.length - 1 ? lastRootRef : null}
            >
              <RootCard root={root} onClick={select_root} />
            </div>
          ))}

          {loadingRoots && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          )}

          {!hasMoreRoots && roots.length > 0 && (
            <div className="text-center text-sm text-gray-500 py-2">
              No more discussions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
