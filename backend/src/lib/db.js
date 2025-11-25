import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

const pool = mysql.createPool({
  host: "127.0.0.1", // hoặc "localhost"
  port: 3306, // ← thêm port (mặc định là 3306, nhưng nên ghi rõ)
  user: "root", // ← username
  password: "123456", // ← password
  database: "myappdb", // ← tên database
});
export const db = drizzle(pool);
