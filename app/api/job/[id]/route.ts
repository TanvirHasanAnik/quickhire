import { NextResponse } from "next/server";
import { getSingleJob, removeJob } from "@/controllers/jobController";
import { verifyAdmin } from "@/utility/token/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await getSingleJob(Number(id));
    return NextResponse.json(job, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    const status = message === "Job not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAdmin(req);
    const { id } = await params;
    const result = await removeJob(Number(id));
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    const status = message.includes("Access denied") || message.includes("authorization") || message.includes("token") ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
