import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import DB from "../db/databse";
import UserSchema from "../model/user.model";
import { NodeSchema } from "../model/node.model";

/* -------------------- Helper Functions -------------------- */

function computeResult(left: number, op: string | null, right: number | null): number {
  if (!op || right === null) return left;
  switch (op) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return right === 0 ? left : left / right;
    default: return left;
  }
}

function randomOperation(): "+" | "-" | "*" | "/" {
  const ops = ["+", "-", "*", "/"];
  return ops[Math.floor(Math.random() * ops.length)] as "+" | "-" | "*" | "/";
}

/* -------------------- Main Seeder -------------------- */

async function seedData() {
  try {
    // ✅ Connect to MongoDB
    await DB.connect();

    console.log("🧹 Clearing old data and resetting indexes...");
    await Promise.all([UserSchema.deleteMany({}), NodeSchema.deleteMany({})]);

    // ✅ Drop all old indexes (especially 'username_1')
    await UserSchema.collection.dropIndexes().catch(() => {});
    await UserSchema.syncIndexes();
    console.log("🔧 User indexes synced successfully.");

    console.log("👥 Creating 3 users...");

    const plainPasswords:any = ["password123", "secret123", "admin123"];
    const users = [
      {
        name: "user_one",
        email: "user1@example.com",
        password: bcrypt.hashSync(plainPasswords[0], 10),
        role: "user",
      },
      {
        name: "user_two",
        email: "user2@example.com",
        password: bcrypt.hashSync(plainPasswords[1], 10),
        role: "user",
      },
      {
        name: "user_three",
        email: "user3@example.com",
        password: bcrypt.hashSync(plainPasswords[2], 10),
        role: "user",
      },
    ];

    const insertedUsers = await UserSchema.insertMany(users, { ordered: true });
    const userIds = insertedUsers.map((u) => u._id);

    console.log(`✅ ${insertedUsers.length} users created`);
    console.log("🧾 Sample User Credentials:");
    insertedUsers.forEach((u, i) => {
      console.log({
        name: u.name,
        email: u.email,
        password: plainPasswords[i],
      });
    });

    console.log("🌳 Creating 1000 root nodes...");
    const roots: any[] = [];

    for (let i = 0; i < 1000; i++) {
      const authorId = faker.helpers.arrayElement(userIds);
      const startValue = faker.number.int({ min: 1, max: 100 });
      roots.push({
        parentId: null,
        rootId: new Types.ObjectId(),
        authorId,
        leftValue: startValue,
        operation: null,
        rightValue: null,
        result: startValue,
      });
    }

    const insertedRoots = await NodeSchema.insertMany(roots);

    // ✅ Fix rootId = _id for each root
    const bulkOps = insertedRoots.map((root) => ({
      updateOne: {
        filter: { _id: root._id },
        update: { rootId: root._id },
      },
    }));
    await NodeSchema.bulkWrite(bulkOps);
    console.log(`✅ ${insertedRoots.length} roots inserted. Creating replies...`);

    /* -------------------- Replies (3 Levels Deep) -------------------- */
    for (const root of insertedRoots) {
      // LEVEL 1
      const level1Nodes: any[] = [];
      for (let i = 0; i < 3; i++) {
        const op = randomOperation();
        const right = faker.number.int({ min: 1, max: 10 });
        const result = computeResult(root.result, op, right);
        level1Nodes.push({
          rootId: root._id,
          parentId: root._id,
          authorId: faker.helpers.arrayElement(userIds),
          leftValue: root.result,
          operation: op,
          rightValue: right,
          result,
        });
      }
      const level1 = await NodeSchema.insertMany(level1Nodes);

      // LEVEL 2
      const level2Nodes: any[] = [];
      for (const parent of level1) {
        for (let i = 0; i < 2; i++) {
          const op = randomOperation();
          const right = faker.number.int({ min: 1, max: 10 });
          const result = computeResult(parent.result, op, right);
          level2Nodes.push({
            rootId: root._id,
            parentId: parent._id,
            authorId: faker.helpers.arrayElement(userIds),
            leftValue: parent.result,
            operation: op,
            rightValue: right,
            result,
          });
        }
      }
      const level2 = await NodeSchema.insertMany(level2Nodes);

      // LEVEL 3
      const level3Nodes: any[] = [];
      for (const parent of level2) {
        const op = randomOperation();
        const right = faker.number.int({ min: 1, max: 10 });
        const result = computeResult(parent.result, op, right);
        level3Nodes.push({
          rootId: root._id,
          parentId: parent._id,
          authorId: faker.helpers.arrayElement(userIds),
          leftValue: parent.result,
          operation: op,
          rightValue: right,
          result,
        });
      }
      await NodeSchema.insertMany(level3Nodes);
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    console.log("🔌 Disconnecting DB...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    DB.disConnect();
  }
}

seedData();
