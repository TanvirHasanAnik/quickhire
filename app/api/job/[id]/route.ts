import { NextResponse } from "next/server";
import { getSingleJob, removeJob } from "@/controllers/jobController";

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
    const { id } = await params;
    // In a real app, verify admin role from JWT here
    const result = await removeJob(Number(id));
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
