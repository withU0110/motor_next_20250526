import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// [GET] 드롭다운 선택 시 R2에서 기존 JSON 불러오기
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // 예: c1

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `manuals/${id}/detail.json`,
    });
    const response = await s3Client.send(command);
    const str = await response.Body?.transformToString();
    return NextResponse.json(JSON.parse(str || "{}"));
  } catch (error) {
    return NextResponse.json({ error: "데이터를 찾을 수 없습니다." }, { status: 404 });
  }
}

// [POST] 수정한 내용으로 R2의 JSON 덮어쓰기
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, jsonData } = data; // 화면에서 보낸 id와 새로운 데이터 덩어리

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `manuals/${id}/detail.json`,
      Body: JSON.stringify(jsonData, null, 2), // 예쁘게 JSON 형식으로 변환
      ContentType: "application/json",
    });

    await s3Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}