import mongoose, { PipelineStage, Types } from "mongoose";
import { applyOperation } from "../helper/node.helper";
import { NodeSchema } from "../model/node.model";

export class NodeService {
  static async createNode(data: {
    parentId?: string;
    authorId: string;
    operation?: string;
    rightValue?: number;
    initialValue?: number;
  }) {
    // ✅ If no parentId => create a ROOT node
    if (!data.parentId) {
      if (typeof data.initialValue !== "number")
        throw new Error("Root node requires an initialValue");

      const rootNode = await NodeSchema.create({
        rootId: null,
        parentId: null,
        authorId: new Types.ObjectId(data.authorId),
        leftValue: null,
        operation: null,
        rightValue: null,
        result: data.initialValue,
        status: "confirmed",
      });
      await rootNode.save();
      return rootNode;
    }

    // ✅ Else, create a CHILD (reply) node
    const parent = await NodeSchema.findById(data.parentId);
    if (!parent) throw new Error("Parent node not found");

    const leftValue = parent.result;
    if (!data.operation || typeof data.rightValue !== "number")
      throw new Error("Child node requires operation and rightValue");

    const result = applyOperation(leftValue, data.operation, data.rightValue);

    const newNode = await NodeSchema.create({
      rootId: parent.rootId || parent._id,
      parentId: new Types.ObjectId(data.parentId),
      authorId: new Types.ObjectId(data.authorId),
      leftValue,
      operation: data.operation,
      rightValue: data.rightValue,
      result,
      status: "confirmed",
    });

    return newNode;
  }

  static async getRoots(cursor?: string, limit: number = 10) {
    const matchStage: PipelineStage.Match = {
      $match: { parentId: null },
    };

    // If a cursor is provided, only fetch documents created before it
    if (cursor) {
      matchStage.$match.createdAt = { $lt: new Date(cursor) };
    }

    const pipeline: PipelineStage[] = [
      matchStage,
      {
        $lookup: {
          from: "nodes",
          localField: "_id",
          foreignField: "rootId",
          as: "children",
        },
      },
      {
        $addFields: {
          replyCount: { $subtract: [{ $size: "$children" }, 1] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          rootId: 1,
          leftValue: 1,
          result: 1,
          replyCount: 1,
          createdAt: 1,
          "author._id": 1,
          "author.username": 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit + 1 }, // fetch one extra to determine if there’s a next page
    ];

    const roots = await NodeSchema.aggregate(pipeline);

    // Determine if there’s a next page
    const hasNextPage = roots.length > limit;

    // Remove the extra fetched item
    const paginatedRoots = hasNextPage ? roots.slice(0, -1) : roots;

    // Next cursor will be the createdAt of the last item
    const nextCursor = hasNextPage
      ? paginatedRoots[paginatedRoots.length - 1].createdAt
      : null;

    return {
      roots: paginatedRoots,
      pagination: {
        nextCursor,
        hasNextPage,
        limit,
      },
    };
  }

  static async getTree(rootId: string, cursor?: string, limit: number = 1000) {
    const queryLimit = Math.min(limit, 2000); // safety cap

    if (!mongoose.Types.ObjectId.isValid(rootId)) {
      throw new Error("Invalid rootId");
    }

    const query: any = { rootId: new mongoose.Types.ObjectId(rootId) };

    // Cursor-based pagination (only newer ObjectIds)
    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $gt: new mongoose.Types.ObjectId(cursor) };
    }

    // Fetch paginated nodes
    const nodes: any = await NodeSchema.find(query)
      .sort({ _id: 1 }) // ascending
      .limit(queryLimit)
      .select(
        "_id parentId rootId operation rightValue result authorId status createdAt"
      )
      .populate("authorId", "username")
      .lean();

    // If empty
    if (!nodes.length) {
      return {
        message: "No more nodes",
        rootId,
        rootNode: null,
        nodes: [],
        count: 0,
        nextCursor: null,
        hasMore: false,
      };
    }

    // Fetch rootNode only if cursor is not provided (first page)
    let rootNode = null;
    if (!cursor) {
      rootNode = await NodeSchema.findOne({ _id: rootId, parentId: null })
        .populate("authorId", "username")
        .select(
          "_id parentId rootId operation rightValue result authorId status createdAt"
        )
        .lean();
    }

    // Determine next cursor
    const nextCursor =
      nodes.length === queryLimit ? nodes[nodes.length - 1]._id : null;

    return {
      message: "Nodes fetched successfully",
      rootId,
      rootNode,
      nodes,
      count: nodes.length,
      nextCursor,
      hasMore: Boolean(nextCursor),
    };
  }

  static async getReplies(
    parentId: string,
    cursor?: string,
    limit: number = 10
  ) {
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      throw new Error("Invalid parentId");
    }

    const queryLimit = Math.min(limit, 100);
    const query: any = { parentId: new mongoose.Types.ObjectId(parentId) };

    // Apply cursor for pagination
    if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
      query._id = { $gt: new mongoose.Types.ObjectId(cursor) };
    }

    // Fetch replies
    const replies: any = await NodeSchema.find(query)
      .sort({ _id: 1 })
      .limit(queryLimit)
      .select(
        "_id parentId rootId operation rightValue result authorId status createdAt"
      )
      .populate("authorId", "username")
      .lean();

    if (!replies.length) {
      return {
        message: "No more replies",
        parentId,
        totalReplies: 0,
        replies: [],
        count: 0,
        nextCursor: null,
        hasMore: false,
      };
    }

    // Next cursor logic
    const nextCursor =
      replies.length === queryLimit ? replies[replies.length - 1]._id : null;

    // Optional total count
    const totalReplies = await NodeSchema.countDocuments({
      parentId: new mongoose.Types.ObjectId(parentId),
    });

    return {
      message: "Replies fetched successfully",
      parentId,
      totalReplies,
      replies,
      count: replies.length,
      nextCursor,
      hasMore: Boolean(nextCursor),
    };
  }
}
