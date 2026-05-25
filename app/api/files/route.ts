import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: "pdf/", // 'pdf/' 폴더 안의 파일만 가져오기
    });

    const response = await s3Client.send(command);
    const files = response.Contents?.map((item) => item.Key) || [];

    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}