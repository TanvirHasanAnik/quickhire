import { NextResponse } from "next/server";
import { getAllJobs, addJob } from "@/controllers/jobController";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor") ? parseInt(searchParams.get("cursor")!) : undefined;

    // Fetch limit + 1 to check if there is a next page
    const jobs = await getAllJobs({ category, location, limit: limit + 1, cursor });

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
    const data = await req.json();
    // In a real app, verify admin role from JWT here
    const newJob = await addJob(data);
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
