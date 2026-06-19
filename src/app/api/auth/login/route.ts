import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
        body.password,
        user.password
    );

    if (!validPassword) {
        return NextResponse.json(
            {
                success: false,
                error: "Invalid password",
            },
            { status: 401 }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Login success",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 }
    );
  }
}