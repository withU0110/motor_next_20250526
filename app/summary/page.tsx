"use client";
import { useEffect, useState } from "react";

export default function SummaryPage() {
  const [imageUrl, setImageUrl] = useState("");

useEffect(() => {
  fetch("/api/image?key=summary.png")
    .then((res) => {
      console.log("응답 상태 코드:", res.status); // 200이 나오는지 확인
      return res.json();
    })
    .then((data) => {
      console.log("받아온 데이터:", data); // { url: "https://..." } 가 오는지 확인
      if (data.url) {
        setImageUrl(data.url);
      }
    })
    .catch((err) => console.error("데이터 불러오기 에러:", err));
}, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">요약도</h2>
      {imageUrl ? (
        <img src={imageUrl} alt="요약도" className="rounded-3xl shadow-md w-full" />
      ) : (
        <div className="bg-gray-200 rounded-3xl h-64 flex items-center justify-center">
          불러오는 중...
        </div>
      )}
    </div>
  );
}