import { NextResponse } from "next/server";
import { submitApplication } from "@/controllers/applicationController";
import { verifyToken } from "@/utility/token/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyToken(req);
    const { id } = await params;
    const data = await req.json();
    
    // Ensure the job_id from path matches if provided in body, or just use path id
    const applicationData = { ...data, job_id: Number(id) };
    
    const newApplication = await submitApplication(applicationData);
    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    const status = message.includes("authorization") || message.includes("token") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
