import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Link from "next/link";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

async function checkFileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    await s3.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

async function getIssueDetail(issueId: string) {
  try {
    const jsonCommand = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `manuals/${issueId}/detail.json`,
    });

    const response = await s3.send(jsonCommand);
    const responseData = await response.Body?.transformToString();
    const detailData = responseData ? JSON.parse(responseData) : null;

    if (!detailData) return null;

    const imageUrls: string[] = [];
    const keys = detailData.imageKeys || (detailData.imageKey ? [detailData.imageKey] : []);
    
    for (const key of keys) {
      if (await checkFileExists(key)) {
        const imgCommand = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key });
        const url = await getSignedUrl(s3, imgCommand, { expiresIn: 3600 });
        imageUrls.push(url);
      }
    }

    let videoUrl = "";
    if (detailData.videoKey && (await checkFileExists(detailData.videoKey))) {
      const videoCommand = new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: detailData.videoKey });
      videoUrl = await getSignedUrl(s3, videoCommand, { expiresIn: 3600 });
    }

    return {
      title: detailData.title,
      description: detailData.description,
      steps: detailData.steps || [],
      imageUrls,
      videoUrl,
      hasImageKey: !!(detailData.imageKeys?.length || detailData.imageKey),
      hasVideoKey: !!detailData.videoKey
    };
  } catch (error) {
    console.error("데이터 덤프 에러:", error);
    return null;
  }
}

export default async function IssueDetailPage({ params }: { params: Promise<{ category: string; issueId: string }> }) {
  const { category, issueId } = await params;
  const detail = await getIssueDetail(issueId);

  if (!detail) {
    return <div className="p-4 text-center text-gray-500">매뉴얼 데이터를 받아오지 못했습니다.</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white max-w-md mx-auto flex flex-col pb-12">
      {/* 뒤로가기 내비게이션 바 */}
      <div className="p-4 border-b flex items-center space-x-3 bg-white sticky top-0 z-10">
        <Link href={`/manual/${category}`} className="text-gray-500 hover:text-gray-800 text-xl font-bold p-1">
          ←
        </Link>
        <h1 className="text-xl font-bold text-gray-900 truncate">{detail.title}</h1>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        {/* 조치 내용 글 */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">{detail.description}</p>
        </div>

        {/* 조치 방법 (기존 조치 순서에서 변경 및 번호 삭제) */}
        {detail.steps.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800 text-lg">조치 방법</h3>
            {/* list-disc 속성을 주어 숫자 대신 원형 글머리 기호로 표현합니다. */}
            <ul className="list-disc pl-5 space-y-2.5 text-base text-gray-700">
              {detail.steps.map((step: string, i: number) => (
                <li key={i} className="pl-1">{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 참고 사진 */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-800 text-lg">참고 사진</h3>
          {detail.imageUrls.length > 0 ? (
            <div className="space-y-3">
              {detail.imageUrls.map((url, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl border bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`가이드 이미지 ${idx + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          ) : (
            detail.hasImageKey && <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-xl text-center">⚠️ 관련 사진 파일이 없습니다.</p>
          )}
        </div>

        {/* 참고 영상 */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-800 text-lg">참고 영상</h3>
          {detail.videoUrl ? (
            <div className="overflow-hidden rounded-2xl border bg-black">
              <video src={detail.videoUrl} controls className="w-full" playsInline />
            </div>
          ) : (
            detail.hasVideoKey && <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-xl text-center">⚠️ 관련 영상 파일이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}