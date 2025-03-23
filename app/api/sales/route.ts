import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongodb";

export async function GET(req: Request) {
  await connectToDatabase();

  try {
    const db = await connectToDatabase();
    const salesData = await db.collection("sales").find({}).limit(100).toArray();

    return NextResponse.json(salesData);
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
