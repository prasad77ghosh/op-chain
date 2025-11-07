export interface Node {
  _id: string;
  parentId: string | null;
  rootId: string;
  leftValue?: number;
  operation: '+' | '-' | '*' | '/' | null;
  rightValue?: number;
  result: number;
  authorId: { _id: string; name: string };
  status: 'confirmed' | 'pending' | 'rejected';
  createdAt: string;
}


export interface Root {
  _id: string;
  result: number;
  replyCount: number;
  createdAt: string;
  author: { _id: string; name: string, email:string };
}


export interface TreeState {
  roots: Root[];
  rootsCursor: string | null;
  hasMoreRoots: boolean;
  loadingRoots: boolean;
  
  selectedRoot: Root | null;
  treeNodes: Node[];
  rootNode: Node | null;
  treeCursor: string | null;
  hasMoreTree: boolean;
  loadingTree: boolean;
  
  expandedNodes: Set<string>;
  nodeReplies: Record<string, Node[]>;
  repliesCursors: Record<string, string | null>;
  hasMoreReplies: Record<string, boolean>;
  loadingReplies: Record<string, boolean>;
  
  // Actions
  setRoots: (roots: Root[], cursor: string | null, hasMore: boolean) => void;
  addRoots: (roots: Root[], cursor: string | null, hasMore: boolean) => void;
  setLoadingRoots: (loading: boolean) => void;
  
  setSelectedRoot: (root: Root | null) => void;
  setTreeData: (rootNode: Node | null, nodes: Node[], cursor: string | null, hasMore: boolean) => void;
  addTreeNodes: (nodes: Node[], cursor: string | null, hasMore: boolean) => void;
  setLoadingTree: (loading: boolean) => void;
  
  toggleNode: (nodeId: string) => void;
  setNodeReplies: (parentId: string, replies: Node[], cursor: string | null, hasMore: boolean) => void;
  addNodeReplies: (parentId: string, replies: Node[], cursor: string | null, hasMore: boolean) => void;
  setLoadingReplies: (parentId: string, loading: boolean) => void;
  
  addNewRoot: (root: Root) => void;
  addNewNode: (node: Node) => void;
  
  reset: () => void;
}


export type ReplyParent = Node | Root | null;