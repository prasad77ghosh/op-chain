import { fieldValidateError } from "../helper";
import { NodeService } from "../services/node.service";
import { AuthRequest } from "../types/auth";
import { NextFunction, Response, Request } from "express";

export class NodeController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);
      const { parentId, operation, rightValue, initialValue } = req.body;
      const authorId: any = req.payload?.userId;
      const node = await NodeService.createNode({
        parentId,
        authorId,
        operation,
        rightValue,
        initialValue
      });
      res.status(201).json({
        success: true,
        msg: "Node Created Successfully...",
        data: node,
      });
    } catch (err) {
      next(err);
    }
  }

  async reply(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);
      const { parentId, operation, rightValue } = req.body;
      const authorId: any = req.payload?.userId;
      const node = await NodeService.createNode({
        parentId,
        authorId,
        operation,
        rightValue,
      });
      return res.status(201).json({
        success: true,
        msg: "Reply created successfully",
        node,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoots(req: Request, res: Response, next: NextFunction) {
  try {
    fieldValidateError(req);

    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt((req.query.limit as string) || "10");

    const { roots, pagination } = await NodeService.getRoots(cursor, limit);

    res.status(200).json({
      success: true,
      msg: "Root discussions fetched successfully",
      roots,
      pagination,
    });
  } catch (error) {
    console.error("Error fetching root discussions:", (error as Error).message);
    next(error);
  }
}


  async getTree(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);

      const { rootId }: any = req.params;
      const { cursor, limit } = req.query;

      const result = await NodeService.getTree(
        rootId,
        cursor as string | undefined,
        parseInt(limit as string) || 1000
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching tree:", (error as Error).message);
      next(error);
    }
  }

  async getReplies(req: Request, res: Response, next: NextFunction) {
    try {
      fieldValidateError(req);
      const { parentId }: any = req.params;
      const { cursor, limit } = req.query;
      const result = await NodeService.getRepliesFast(
        parentId,
        cursor as string | undefined,
        parseInt(limit as string, 10) || 10
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching replies:", (error as Error).message);
      next(error);
    }
  }
}
