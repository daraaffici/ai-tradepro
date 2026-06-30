import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hello: "THIS_IS_NEW_CODE_123456"
  });
}