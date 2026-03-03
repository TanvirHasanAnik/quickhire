import { getDb } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export interface Category extends RowDataPacket {
  id: number;
  name: string;
  created_at: Date;
}

export async function getCategories() {
  const db = await getDb();
  const [rows] = await db.query<Category[]>("SELECT * FROM categories ORDER BY name ASC");
  return rows;
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  const [rows] = await db.query<Category[]>("SELECT * FROM categories WHERE id = ?", [id]);
  return rows[0] || null;
}
