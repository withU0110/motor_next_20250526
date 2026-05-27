"use client";
import { useState, useEffect } from "react";

export default function AdminEditor() {
  const [selectedId, setSelectedId] = useState("c1");
  const [manual, setManual] = useState({
    title: "",
    description: "",
    steps: "", // 편의상 줄바꿈(\n) 텍스트로 관리
    imageKeys: [],
    videoKey: ""
  });

  // 1. 드롭다운이 바뀔 때마다 API를 호출해서 데이터 불러오기
  useEffect(() => {
    fetch(`/api/admin/manual?id=${selectedId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setManual({
            title: data.title,
            description: data.description,
            // 배열로 된 steps를 화면 편집을 위해 엔터(\n) 단위 문자열로 변환
            steps: data.steps ? data.steps.join("\n") : "",
            imageKeys: data.imageKeys || [],
            videoKey: data.videoKey || ""
          });
        }
      });
  }, [selectedId]);

  // 2. 저장 버튼 클릭 시 작동하는 함수
  const handleSave = async () => {
    // 다시 배열 형태로 조립 (미디어 키는 원본 그대로 유지!)
    const payload = {
      title: manual.title,
      description: manual.description,
      steps: manual.steps.split("\n").filter(step => step.trim() !== ""),
      imageKeys: manual.imageKeys, // 💡 수정 불가능하게 고정된 값
      videoKey: manual.videoKey    // 💡 수정 불가능하게 고정된 값
    };

    const res = await fetch("/api/admin/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedId, jsonData: payload })
    });

    if (res.ok) alert("R2에 성공적으로 저장되었습니다!");
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">🛠️ 매뉴얼 수정 모드</h2>
      
      {/* 🔹 ID 선택 드롭다운 */}
      <select 
        className="w-full border p-2 rounded"
        value={selectedId} 
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="c1">[공압] c1: 공기압누설</option>
        <option value="c2">[공압] c2: 공압라인 이상</option>
        <option value="e1">[전기] e1: 안내륜 소음</option>
      </select>

      {/* 🔹 제목 입력 (수정 가능) */}
      <div>
        <label className="text-sm font-bold text-gray-600">제목 (Title)</label>
        <input 
          type="text" className="w-full border p-2 rounded"
          value={manual.title}
          onChange={(e) => setManual({...manual, title: e.target.value})}
        />
      </div>

      {/* 🔹 설명 입력 (수정 가능) */}
      <div>
        <label className="text-sm font-bold text-gray-600">설명 (Description)</label>
        <textarea 
          className="w-full border p-2 rounded h-24"
          value={manual.description}
          onChange={(e) => setManual({...manual, description: e.target.value})}
        />
      </div>

      {/* 🔹 조치 순서 입력 (엔터로 구분) */}
      <div>
        <label className="text-sm font-bold text-gray-600">조치 순서 (엔터로 구분)</label>
        <textarea 
          className="w-full border p-2 rounded h-32"
          value={manual.steps}
          onChange={(e) => setManual({...manual, steps: e.target.value})}
        />
      </div>

      {/* 🔹 💡 미디어 정보 (읽기 전용 / 숨김 처리 가능) */}
      <div className="bg-gray-100 p-3 rounded text-xs text-gray-500">
        <p>첨부된 이미지: {manual.imageKeys.length}장 (고정됨)</p>
        <p>첨부된 영상: {manual.videoKey ? "있음" : "없음"} (고정됨)</p>
      </div>

      <button 
        onClick={handleSave}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg"
      >
        R2 서버에 저장하기
      </button>
    </div>
  );
}