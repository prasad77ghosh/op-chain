import { Schema, model, Document, Types } from "mongoose";

export interface INode extends Document {
  rootId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  authorId: Types.ObjectId;
  leftValue: number;
  operation: "+" | "-" | "*" | "/" | null;
  rightValue: number | null;
  result: number;
  createdAt: Date;
  status: "confirmed" | "pending" | "rejected";
}

const nodeSchema = new Schema<INode>(
  {
    rootId: {
      type: Schema.Types.ObjectId,
      ref: "Node",
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Node",
      default: null,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    leftValue: { type: Number },
    operation: {
      type: String,
      enum: ["+", "-", "*", "/", null],
      default: null,
    },
    rightValue: {
      type: Number,
      default: null,
    },
    result: { type: Number},
    status: {
      type: String,
      enum: ["confirmed", "pending", "rejected"],
      default: "confirmed",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

nodeSchema.pre("save", function (next) {
  if (!this.parentId) {
    this.rootId = this._id as Types.ObjectId;
  }
  next();
});

nodeSchema.index({ rootId: 1, _id: 1 });
nodeSchema.index({ parentId: 1, _id: 1 });
nodeSchema.index({ authorId: 1, createdAt: -1 });

export const NodeSchema = model<INode>("Node", nodeSchema);
