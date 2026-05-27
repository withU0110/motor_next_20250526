export const dynamic = "force-dynamic";

import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Link from "next/link";

// R2 클라이언트 정의
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

// 📌 실제 R2 파일명과 앱에서 보여줄 한글 이름을 일치시키는 변환 사전 (유지보수용)
const pdfNameMap: Record<string, string> = {
  "motor_manual.pdf": "모터카 유지보수 매뉴얼",
  "em_guide.pdf": "계기반 경고알람 조치방법",
  "daily_inspection.pdf": "일상점검 세부방법",
};

async function getPdfReferences() {
  try {
    // references/ 폴더 하위의 오브젝트 목록 가져오기
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: "references/",
    });

    const listResponse = await s3.send(listCommand);
    const contents = listResponse.Contents || [];

    const pdfList = [];

    for (const item of contents) {
      const key = item.Key || "";
      
      // 폴더 자체가 아닌 .pdf 파일만 필터링
      if (key.endsWith(".pdf")) {
        const fileName = key.replace("references/", ""); // 순수 파일명 추출
        
        // 이름 사전에 등록되어 있으면 매핑된 이름을 쓰고, 없으면 실제 파일명을 그대로 사용
        const displayName = pdfNameMap[fileName] || fileName;

        // 클릭 시 바로 열 수 있도록 안전한 1시간짜리 임시 보안 링크 생성
        const getCommand = new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: key,
        });
        const viewUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

        pdfList.push({
          key,
          displayName,
          viewUrl,
          size: item.Size ? `${(item.Size / (1024 * 1024)).toFixed(2)} MB` : "--"
        });
      }
    }

    return pdfList;
  } catch (error) {
    console.error("R2에서 PDF 목록을 읽어오는 중 에러 발생:", error);
    return [];
  }
}

export default async function ReferencesPage() {
  const pdfFiles = await getPdfReferences();

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24">
      {/* 헤더 */}
      <div className="border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">참고자료</h2>
          <p className="text-xs text-gray-400 mt-1">철도장비 유지보수 관련 자료</p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
          총 {pdfFiles.length}건
        </span>
      </div>

      {/* PDF 파일 목록 리스트 */}
      {pdfFiles.length > 0 ? (
        <div className="space-y-3">
          {pdfFiles.map((file) => (
            <a
              key={file.key}
              href={file.viewUrl}
              target="_blank" // 새 탭에서 열기
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-3 truncate">
                <span className="text-2xl">📄</span>
                <div className="truncate">
                  <p className="font-semibold text-gray-800 text-sm truncate">{file.displayName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">용량: {file.size}</p>
                </div>
              </div>
              <span className="text-xs text-blue-500 font-bold bg-blue-50 px-2 py-1 rounded-lg shrink-0 ml-2">
                열기
              </span>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-400">등록된 참고자료 문서가 없습니다.</p>
          <p className="text-xs text-gray-300 mt-1">R2 버킷의 `references/` 경로를 확인해 주세요.</p>
        </div>
      )}
    </div>
  );
}