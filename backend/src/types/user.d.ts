export 
interface User {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}