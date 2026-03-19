import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "This legacy Next.js route is disabled. Use the Express API at /api/diabetes/predict instead.",
    },
    { status: 410 },
  );
}
