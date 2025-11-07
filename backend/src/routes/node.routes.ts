import { Router } from "express";
import { NodeController } from "../controllers/node.controller";
import { NodeValidator } from "../validator/node.validator";
import ProtectedMiddleware from "../middlewares/protected.middleware";

export default class NodeRoutes {
  public router: Router;
  private nodeController: NodeController;
  public path = "tree";

  constructor() {
    this.router = Router();
    this.nodeController = new NodeController();
    this.routes();
  }

  private routes() {
    this.router.post(
      "/add-node",
      new ProtectedMiddleware().protected,
      NodeValidator.createNodeValidator,
      this.nodeController.create
    );

    this.router.post(
      "/reply-to-node",
      new ProtectedMiddleware().protected,
      NodeValidator.createReplyValidator,
      this.nodeController.reply
    );

    this.router.get(
      "/get-roots",
      NodeValidator.getRootsValidator,
      this.nodeController.getRoots
    );

    this.router.get(
      "/get-full-tree/:rootId",
      NodeValidator.getTreeValidator,
      this.nodeController.getTree
    );

    this.router.get(
      "/get-replies/:parentId",
      NodeValidator.getRepliesValidator,
      this.nodeController.getReplies
    );
  }
}
