"use client";
import { useEffect, useState } from "react";

export default function SummaryPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetch("/api/image?key=summary.png")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.url) {
          setImageUrl(data.url);
        }
      })
      .catch((err) => console.error("데이터 불러오기 에러:", err));
  }, []);

  // 📌 이미지를 파일로 강제 다운로드하는 함수
  const handleDownload = async () => {
    if (!imageUrl) return;

    try {
      setIsDownloading(true);
      
      // 1. 이미지 데이터를 Blob(순수 데이터 덩어리) 형태로 가져옵니다.
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // 2. Blob 데이터를 브라우저 임시 URL로 변환합니다.
      const blobUrl = window.URL.createObjectURL(blob);
      
      // 3. 눈에 보이지 않는 <a> 태그를 만들어 클릭 이벤트를 강제로 발생시킵니다.
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "summary.png"; // 저장될 파일 이름 지정
      document.body.appendChild(link);
      link.click();
      
      // 4. 다운로드 완료 후 메모리 정리
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error("다운로드 에러:", error);
      // 만약 R2 스토리지의 보안(CORS) 설정으로 인해 Blob 다운로드가 막히면
      // 대체 방법으로 이미지를 새 창에 띄워 사용자가 직접 꾹 눌러 저장할 수 있게 유도합니다.
      alert("직접 다운로드가 제한된 환경입니다.\n열린 새 창에서 이미지를 꾹 눌러 저장해 주세요.");
      window.open(imageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24">
      {/* 🔹 상단 타이틀 및 다운로드 버튼 영역 */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">요약도</h2>
        
        {/* 이미지가 불러와졌을 때만 다운로드 버튼을 보여줍니다 */}
        {imageUrl && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
              isDownloading 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95"
            }`}
          >
            <span className="text-lg">{isDownloading ? "⏳" : "💾"}</span>
            <span>{isDownloading ? "다운로드 중..." : "저장하기"}</span>
          </button>
        )}
      </div>

      {/* 🔹 이미지 표시 영역 */}
      {imageUrl ? (
        <div className="overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="요약도" className="w-full h-auto object-contain" />
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl h-64 flex flex-col items-center justify-center border border-gray-200 border-dashed space-y-3">
          <span className="text-4xl">🖼️</span>
          <span className="text-sm font-semibold text-gray-400">요약도 불러오는 중...</span>
        </div>
      )}
    </div>
  );
}