import { auth, currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import xlsx from "xlsx";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    const type = data.get("type");
    const userId = data.get("userid");

    // const userId =  await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const userId = user?.emailAddresses?.[0]?.emailAddress;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = xlsx.read(buffer, { type: "buffer" });

    // Convert first sheet to JSON
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const processedData = sheetData.map((row: any) => {
      return {
        ...row,
        "Invoice Date": convertExcelDate(row["Invoice Date"]), // Convert Invoice Date
        "DUE DATE": convertExcelDate(row["DUE DATE"]), // Convert Due Date
      };
    });

    // ✅ Store all data in a single document
    const db = await connectToDatabase();
    await db.collection("sales").insertOne({
      uploadedAt: new Date(),
      userId : userId,
      datatype: type,
      data: processedData, // Store entire data as an array inside one object
    });

    return NextResponse.json({ message: "File uploaded and data saved as a single object" });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}


function convertExcelDate(excelDate: any) {
  if (typeof excelDate === "number") {
    // Convert Excel serial number to JavaScript Date
    const date = xlsx.SSF.parse_date_code(excelDate);
    return new Date(Date.UTC(date.y, date.m - 1, date.d));
  }
  return excelDate; // Return as is if not a number
}