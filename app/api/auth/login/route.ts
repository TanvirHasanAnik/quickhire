import { NextResponse } from "next/server";
import { loginUser } from "@/controllers/userController";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await loginUser(data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
