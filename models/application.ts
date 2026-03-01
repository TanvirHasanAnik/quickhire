import { pool } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Application extends RowDataPacket {
  id: number;
  job_id: number;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
  created_at: Date;
}

// Create a new application
export async function createApplication(data: {
  job_id: number;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
}) {
  const { job_id, name, email, resume_link, cover_note } = data;

  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO applications (job_id, name, email, resume_link, cover_note) VALUES (?, ?, ?, ?, ?)",
    [job_id, name, email, resume_link, cover_note || null]
  );

  return { id: result.insertId, ...data };
}

// Get all applications for a specific job
export async function getApplicationsByJob(job_id: number) {
  const [rows] = await pool.query<Application[]>(
    "SELECT * FROM applications WHERE job_id = ? ORDER BY created_at DESC",
    [job_id]
  );
  return rows;
}

// Get a single application by ID
export async function getApplicationById(id: number) {
  const [rows] = await pool.query<Application[]>(
    "SELECT * FROM applications WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

// Delete an application by ID
export async function deleteApplication(id: number) {
  await pool.query("DELETE FROM applications WHERE id = ?", [id]);
}