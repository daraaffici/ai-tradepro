import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    analysis:
      "AI Analysis temporarily unavailable. OpenAI billing is not active yet.",
  });
}