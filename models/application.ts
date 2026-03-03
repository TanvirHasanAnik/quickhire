import { getDb } from "@/lib/db";
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

export async function createApplication(data: {
  job_id: number;
  name: string;
  email: string;
  resume_link: string;
  cover_note?: string;
}) {
  const db = await getDb();
  const { job_id, name, email, resume_link, cover_note } = data;

  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO applications (job_id, name, email, resume_link, cover_note) VALUES (?, ?, ?, ?, ?)",
    [job_id, name, email, resume_link, cover_note || null]
  );

  return { id: result.insertId, ...data };
}

export async function getApplicationsByJob(job_id: number) {
  const db = await getDb();
  const [rows] = await db.query<Application[]>(
    "SELECT * FROM applications WHERE job_id = ? ORDER BY created_at DESC",
    [job_id]
  );
  return rows;
}

export async function getApplicationById(id: number) {
  const db = await getDb();
  const [rows] = await db.query<Application[]>(
    "SELECT * FROM applications WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

export async function deleteApplication(id: number) {
  const db = await getDb();
  await db.query("DELETE FROM applications WHERE id = ?", [id]);
}
