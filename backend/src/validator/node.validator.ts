import { body, param, query } from "express-validator";

export const NodeValidator = {
  createNodeValidator: [
    // parentId: optional (only required for replies)
    body("parentId")
      .optional()
      .isMongoId()
      .withMessage("Invalid parentId format"),

    // If parentId exists => operation & rightValue are required
    body("operation")
      .if(body("parentId").exists())
      .notEmpty()
      .withMessage("operation is required when parentId is provided")
      .isIn(["+", "-", "*", "/"])
      .withMessage("Invalid operation. Allowed: +, -, *, /"),

    body("rightValue")
      .if(body("parentId").exists())
      .notEmpty()
      .withMessage("rightValue is required when parentId is provided")
      .isNumeric()
      .withMessage("rightValue must be a number"),

    // If parentId does NOT exist => initialValue is required for root node
    body("initialValue")
      .if(body("parentId").not().exists())
      .notEmpty()
      .withMessage("initialValue is required when creating a root node")
      .isNumeric()
      .withMessage("initialValue must be a number"),
  ],
  createReplyValidator: [
    body("parentId")
      .notEmpty()
      .withMessage("parentId is required")
      .isMongoId()
      .withMessage("Invalid parentId format"),

    body("operation")
      .notEmpty()
      .withMessage("operation is required")
      .isIn(["+", "-", "*", "/"])
      .withMessage("Invalid operation"),

    body("rightValue")
      .notEmpty()
      .withMessage("rightValue is required")
      .isNumeric()
      .withMessage("rightValue must be a number"),
  ],

  getRootsValidator: [
    query("cursor")
      .optional()
      .isISO8601()
      .withMessage("Cursor must be a valid ISO date string"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be a number between 1 and 100"),
  ],

  getTreeValidator: [
    param("rootId")
      .notEmpty()
      .withMessage("rootId is required")
      .isMongoId()
      .withMessage("Invalid rootId format"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 2000 })
      .withMessage("limit must be an integer between 1 and 2000"),

    query("cursor")
      .optional()
      .isMongoId()
      .withMessage("cursor must be a valid ObjectId"),
  ],

  getRepliesValidator: [
    param("parentId")
      .notEmpty()
      .withMessage("parentId is required")
      .isMongoId()
      .withMessage("Invalid parentId format"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be between 1 and 100"),

    query("cursor")
      .optional()
      .isMongoId()
      .withMessage("cursor must be a valid ObjectId"),
  ],
};
