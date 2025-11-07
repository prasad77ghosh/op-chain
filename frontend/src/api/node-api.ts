import axiosInstance from "./axiosInstance";

export const api = {
  getRoots: async (cursor?: string, limit = 10) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());
    const response = await axiosInstance.get(`/tree/get-roots?${params}`);
    return response.data;
  },

  getTree: async (rootId: string, cursor?: string, limit = 5) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());
    const response = await axiosInstance.get(
      `/tree/get-full-tree/${rootId}?${params}`
    );
    return response.data;
  },

  getReplies: async (parentId: string, cursor?: string, limit = 10) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", limit.toString());
    const response = await axiosInstance.get(
      `/tree/get-replies/${parentId}?${params}`
    );
    return response.data;
  },

  createRoot: async (initialValue: number, token: string) => {
    const response = await axiosInstance.post(
      `/tree/add-node`,
      { initialValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  createReply: async (
    parentId: string,
    operation: string,
    rightValue: number,
    token: string
  ) => {
    const response = await axiosInstance.post(
      `/tree/reply-to-node`,
      { parentId, operation, rightValue },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
