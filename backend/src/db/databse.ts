import mongoose from "mongoose";
import { db_url } from "../config";

class DataBase {
  private static uri: string = db_url;
  public static connect() {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(this.uri)
      .then(() => {
        console.log("DB Connected Successfully..");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  }
  public static disConnect() {
    mongoose
      .disconnect()
      .then(() => {
        console.log("DB DisConnected Successfully..");
      })
      .catch((error) => {
        console.error("Error disConnecting to MongoDB:", error);
      });
  }
}

const DB = DataBase
export default DB;
