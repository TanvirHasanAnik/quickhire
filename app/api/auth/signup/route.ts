import { NextResponse } from "next/server";
import { registerUser } from "@/controllers/userController";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newUser = await registerUser(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
