import { pool } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Job extends RowDataPacket {
  id: number;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  created_at: Date;
}


export async function getJobs(filters?: { category?: string; location?: string }) {
  let sql = "SELECT * FROM jobs";
  const conditions: string[] = [];
  const params: (string | undefined)[] = []; // <--- typed instead of any

  if (filters?.category) {
    conditions.push("category = ?");
    params.push(filters.category);
  }
  if (filters?.location) {
    conditions.push("location = ?");
    params.push(filters.location);
  }

  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY created_at DESC";

  const [rows] = await pool.query<Job[]>(sql, params);
  return rows;
}

export async function getJobById(id: number) {
  const [rows] = await pool.query<Job[]>("SELECT * FROM jobs WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function createJob(data: {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
}) {
  const { title, company, location, category, description } = data;

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO jobs (title, company, location, category, description) VALUES (?, ?, ?, ?, ?)",
    [title, company, location, category, description]
  );

  return { id: result.insertId, ...data };
}

export async function deleteJob(id: number) {
  await pool.query("DELETE FROM jobs WHERE id = ?", [id]);
}