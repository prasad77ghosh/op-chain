import { api } from "@/api/node-api";
import { CreateReplyModal } from "@/components/nodes/CreateReplyModal";
import { CreateRootModal } from "@/components/nodes/CreateRootModal";
import LeftBar from "@/components/nodes/LeftBar";
import RightBar from "@/components/nodes/RIghtBar";
import { useAuthStore } from "@/store/useAuthStore";
import { useTreeStore } from "@/store/useNodeStore";
import type { ReplyParent } from "@/types";
import { Calculator, Plus } from "lucide-react";
import { useEffect, useState } from "react";

// Main App Component
export default function MathTreeApp() {
  const { roots, selectedRoot, setRoots, setLoadingRoots } = useTreeStore();
  const { user } = useAuthStore();
  const [showCreateRoot, setShowCreateRoot] = useState(false);
  const [showCreateReply, setShowCreateReply] = useState(false);
  const [replyParent, setReplyParent] = useState<ReplyParent>(null);

  useEffect(() => {
    loadRoots();
  }, []);

  const loadRoots = async () => {
    setLoadingRoots(true);
    try {
      const data = await api.getRoots();
      setRoots(
        data.roots,
        data.pagination.nextCursor,
        data.pagination.hasNextPage
      );
    } catch (error) {
      console.error("Error loading roots:", error);
    } finally {
      setLoadingRoots(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-1">
        <div className="flex py-3 px-1 w-full justify-end">
          {user?._id && (
            <button
              onClick={() => setShowCreateRoot(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Discussion
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-5rem)]">
          <LeftBar roots={roots} />

          <div className="lg:col-span-2 h-full min-h-0">
            {selectedRoot ? (
              <RightBar
                setShowCreateReply={setShowCreateReply}
                setReplyParent={setReplyParent}
              />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center h-full flex flex-col justify-center">
                <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Select a Discussion
                </h3>
                <p className="text-gray-500">
                  Choose a discussion from the left panel to view its
                  calculation tree
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateRootModal
        isOpen={showCreateRoot}
        onClose={() => setShowCreateRoot(false)}
        onSuccess={() => {
          loadRoots();
        }}
      />

      <CreateReplyModal
        isOpen={showCreateReply}
        onClose={() => {
          setShowCreateReply(false);
          setReplyParent(null);
        }}
        parentNode={replyParent}
        onSuccess={() => {}}
      />
    </div>
  );
}
