import { NextResponse } from "next/server";
import { getCategories } from "@/models/category";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
