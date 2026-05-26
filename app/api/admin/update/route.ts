import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  try {
    // 클라이언트(관리자 화면)에서 보낸 수정된 데이터를 받습니다.
    const { issueId, newTitle, newDescription, newSteps } = await request.json();

    const key = `manuals/${issueId}/detail.json`;

    // 1. 기존 JSON 데이터를 먼저 불러와서 이미지/비디오 URL(Key)이 날아가지 않게 보존합니다.
    let existingData = {};
    try {
      const getCommand = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key });
      const response = await s3.send(getCommand);
      const responseData = await response.Body?.transformToString();
      if (responseData) existingData = JSON.parse(responseData);
    } catch (e) {
      console.log("기존 파일이 없어 새로 생성합니다.");
    }

    // 2. 기존 데이터에 새로 수정된 글(title, description, steps)만 덮어씌웁니다.
    const updatedData = {
      ...existingData,
      title: newTitle,
      description: newDescription,
      steps: newSteps,
    };

    // 3. R2에 수정한 JSON 데이터를 업로드(덮어쓰기) 합니다.
    const putCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: JSON.stringify(updatedData, null, 2), // 예쁘게 JSON 포맷팅
      ContentType: "application/json",
    });

    await s3.send(putCommand);

    return NextResponse.json({ success: true, message: "성공적으로 수정되었습니다." });
  } catch (error) {
    console.error("업데이트 에러:", error);
    return NextResponse.json({ success: false, error: "수정 중 오류가 발생했습니다." }, { status: 500 });
  }
}