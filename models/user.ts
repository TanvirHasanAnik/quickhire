import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  created_at: Date;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}) {
  const password_hash = await bcrypt.hash(data.password, 10);

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [data.name, data.email, password_hash, data.role || "user"]
  );

  return { id: result.insertId, name: data.name, email: data.email, role: data.role || "user" };
}

export async function getUserByEmail(email: string) {
  const [rows] = await pool.query<User[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

export async function getUserById(id: number) {
  const [rows] = await pool.query<User[]>(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

export async function checkPassword(user: User, password: string) {
  return bcrypt.compare(password, user.password_hash);
}

export async function deleteUser(id: number) {
  await pool.query("DELETE FROM users WHERE id = ?", [id]);
}