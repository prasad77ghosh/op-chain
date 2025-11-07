import type { TreeState } from "@/types";
import { create } from "zustand";

export const useTreeStore = create<TreeState>((set) => ({
  roots: [],
  rootsCursor: null,
  hasMoreRoots: true,
  loadingRoots: false,

  selectedRoot: null,
  treeNodes: [],
  rootNode: null,
  treeCursor: null,
  hasMoreTree: true,
  loadingTree: false,

  expandedNodes: new Set(),
  nodeReplies: {},
  repliesCursors: {},
  hasMoreReplies: {},
  loadingReplies: {},

  setRoots: (roots, cursor, hasMore) =>
    set({ roots, rootsCursor: cursor, hasMoreRoots: hasMore }),
  addRoots: (roots, cursor, hasMore) =>
    set((state) => ({
      roots: [...state.roots, ...roots],
      rootsCursor: cursor,
      hasMoreRoots: hasMore,
    })),
  setLoadingRoots: (loading) => set({ loadingRoots: loading }),

  setSelectedRoot: (rootId) => set({ selectedRoot: rootId }),
  setTreeData: (rootNode, nodes, cursor, hasMore) =>
    set({
      rootNode,
      treeNodes: nodes,
      treeCursor: cursor,
      hasMoreTree: hasMore,
    }),
  addTreeNodes: (nodes, cursor, hasMore) =>
    set((state) => ({
      treeNodes: [...state.treeNodes, ...nodes],
      treeCursor: cursor,
      hasMoreTree: hasMore,
    })),
  setLoadingTree: (loading) => set({ loadingTree: loading }),

  toggleNode: (nodeId) =>
    set((state) => {
      const newExpanded = new Set(state.expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { expandedNodes: newExpanded };
    }),


    setNodeReplies: (parentId, replies, cursor, hasMore) =>
  set((state) => ({
    nodeReplies: { ...state.nodeReplies, [parentId]: replies },
    repliesCursors: { ...state.repliesCursors, [parentId]: cursor },
    hasMoreReplies: { ...state.hasMoreReplies, [parentId]: hasMore },
  })),

  // setNodeReplies: (parentId, replies, cursor, hasMore) =>
  //   set((state) => ({
  //     nodeReplies: { ...state.nodeReplies, [parentId]: replies },
  //     repliesCursors: { ...state.repliesCursors, [parentId]: cursor },
  //     hasMoreReplies: { ...state.hasMoreReplies, [parentId]: hasMore },
  //   })),

  addNodeReplies: (parentId, replies, cursor, hasMore) =>
    set((state) => ({
      nodeReplies: {
        ...state.nodeReplies,
        [parentId]: [...(state.nodeReplies[parentId] || []), ...replies],
      },
      repliesCursors: { ...state.repliesCursors, [parentId]: cursor },
      hasMoreReplies: { ...state.hasMoreReplies, [parentId]: hasMore },
    })),

  setLoadingReplies: (parentId, loading) =>
    set((state) => ({
      loadingReplies: { ...state.loadingReplies, [parentId]: loading },
    })),

  addNewRoot: (root) => set((state) => ({ roots: [root, ...state.roots] })),

  addNewNode: (node) =>
    set((state) => {
      if (!node.parentId) {
        return { treeNodes: [node, ...state.treeNodes] };
      }

      return {
        nodeReplies: {
          ...state.nodeReplies,
          [node.parentId]: [node, ...(state.nodeReplies[node.parentId] || [])],
        },
      };
    }),
  // addNewNode: (node) =>
  //   set((state) => {
  //     // ✅ If replying directly to the root (no parentId)
  //     if (!node.parentId) {
  //       return { treeNodes: [node, ...state.treeNodes] };
  //     }

  //     // ✅ If replying to a child node
  //     return {
  //       nodeReplies: {
  //         ...state.nodeReplies,
  //         [node.parentId]: [...(state.nodeReplies[node.parentId] || []), node],
  //       },
  //     };
  //   }),
  reset: () =>
    set({
      selectedRoot: null,
      treeNodes: [],
      rootNode: null,
      treeCursor: null,
      hasMoreTree: true,
      expandedNodes: new Set(),
      nodeReplies: {},
      repliesCursors: {},
      hasMoreReplies: {},
      loadingReplies: {},
    }),
}));
