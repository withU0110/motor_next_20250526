"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [issueId, setIssueId] = useState("e1");
  const [title, setTitle] = useState("견인전동기 과열 발생 조치법");
  const [description, setDescription] = useState("설명글을 여기에 적으세요.");
  const [steps, setSteps] = useState("통합 제어반 확인\n팬 격리 상태 확인");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!confirm("정말 수정하시겠습니까? (R2에 즉시 반영됩니다)")) return;

    setLoading(true);
    const stepArray = steps.split("\n").filter(s => s.trim() !== "");

    try {
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId,
          newTitle: title,
          newDescription: description,
          newSteps: stepArray
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("매뉴얼이 성공적으로 수정되었습니다!");
      } else {
        alert("수정 실패: " + data.error);
      }
    } catch (error) {
      console.error("R2 전송 실패:", error);
      alert("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white max-w-md mx-auto flex flex-col">
      
      {/* 상단 고정 헤더 영역 */}
      <div className="p-4 border-b flex items-center space-x-3 bg-white sticky top-0 z-10">
        <Link href="/settings" className="text-2xl text-gray-400 hover:text-gray-700 p-1 transition-colors">
          ←
        </Link>
        <h2 className="text-xl font-bold text-red-600">관리자 모드 (매뉴얼 수정)</h2>
      </div>

      {/* 입력 폼 본문 영역 */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-28">
        <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-[11px] text-red-600 leading-normal">
          ⚠️ 이곳에서 내용을 수정하고 저장하면 R2 스토리지의 해당 JSON 파일이 실시간으로 업데이트되며, 현장 작업자 앱에 즉시 반영됩니다.
        </div>

        <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">수정할 장애 ID (R2 폴더명)</label>
            <input 
              type="text"
              value={issueId} 
              onChange={e => setIssueId(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 font-mono" 
              placeholder="예: e1, c1, ct1" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">장애 명칭 (제목)</label>
            <input 
              type="text"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">상세 현상 및 조치 가이드</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 h-28 resize-none leading-relaxed" 
            />
          </div>

          <div>
            {/* 명칭 변경 및 플레이스홀더 숫자 제거 */}
            <label className="block text-xs font-bold text-gray-500 mb-1">조치 방법 항목 (한 줄에 하나씩 엔터로 구분)</label>
            <textarea 
              value={steps} 
              onChange={e => setSteps(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 h-32 resize-none leading-relaxed font-sans" 
              placeholder="통합 제어반 기기 상태 확인&#10;안전선 확보 후 주회로 차단 조치"
            />
          </div>

          <button 
            onClick={handleUpdate} 
            disabled={loading}
            className={`w-full py-4 text-white font-bold rounded-xl shadow-md transition-all text-sm ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 active:scale-[0.99]"
            }`}
          >
            {loading ? "R2 서버 저장 중..." : "R2 서버 데이터 업데이트"}
          </button>
        </div>
      </div>
    </div>
  );
}