import { NextResponse } from "next/server";
import { getAllJobs, addJob } from "@/controllers/jobController";
import { verifyAdmin } from "@/utility/token/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get("category_id") ? parseInt(searchParams.get("category_id")!) : undefined;
    const location = searchParams.get("location") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor") ? parseInt(searchParams.get("cursor")!) : undefined;

    // Fetch limit + 1 to check if there is a next page
    const jobs = await getAllJobs({ category_id, location, limit: limit + 1, cursor });

    const hasNextPage = jobs.length > limit;
    const data = hasNextPage ? jobs.slice(0, limit) : jobs;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return NextResponse.json({
      data,
      pagination: {
        limit,
        next_cursor: nextCursor,
        has_next_page: hasNextPage,
      },
    }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    verifyAdmin(req);
    const data = await req.json();
    const newJob = await addJob(data);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    const status = message.includes("Access denied") || message.includes("authorization") || message.includes("token") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
