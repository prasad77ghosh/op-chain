import "dotenv/config";
export const port = Number(process.env.PORT);
export const db_url = String(process.env.MONGO_URI);