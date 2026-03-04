import { getDb } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Job extends RowDataPacket {
  id: number;
  title: string;
  company: string;
  location: string;
  category_id: number;
  category_name?: string;
  description: string;
  created_at: Date;
}


export async function getJobs(filters?: { keyword?: string; category_id?: number; location?: string; limit?: number; cursor?: number }) {
  const db = await getDb();
  let sql = `
    SELECT j.*, c.name as category_name 
    FROM jobs j 
    LEFT JOIN categories c ON j.category_id = c.id
  `;
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.keyword) {
    conditions.push("(j.title LIKE ? OR j.description LIKE ?)");
    params.push(`%${filters.keyword}%`);
    params.push(`%${filters.keyword}%`);
  }
  if (filters?.category_id) {
    conditions.push("j.category_id = ?");
    params.push(filters.category_id);
  }
  if (filters?.location) {
    conditions.push("j.location = ?");
    params.push(filters.location);
  }
  if (filters?.cursor) {
    conditions.push("j.id < ?");
    params.push(filters.cursor);
  }

  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
  
  sql += " ORDER BY j.id DESC";

  if (filters?.limit) {
    sql += " LIMIT ?";
    params.push(filters.limit);
  }

  const [rows] = await db.query<Job[]>(sql, params);
  
  return rows;
}

export async function getJobById(id: number) {
  const db = await getDb();
  const [rows] = await db.query<Job[]>(`
    SELECT j.*, c.name as category_name 
    FROM jobs j 
    LEFT JOIN categories c ON j.category_id = c.id 
    WHERE j.id = ?
  `, [id]);
  return rows[0] || null;
}

export async function createJob(data: {
  title: string;
  company: string;
  location: string;
  category_id: number;
  description: string;
}) {
  const db = await getDb();
  const { title, company, location, category_id, description } = data;

  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO jobs (title, company, location, category_id, description) VALUES (?, ?, ?, ?, ?)",
    [title, company, location, category_id, description]
  );

  return { id: result.insertId, ...data };
}

export async function deleteJob(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM jobs WHERE id = ?", [id]);
}
