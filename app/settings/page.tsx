"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  
  // 모달 상태 관리
  const [showContact, setShowContact] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [password, setPassword] = useState("");

  // 관리자 비밀번호 확인 로직
  const handleAdminLogin = () => {
    if (password === "1234") {
      setShowAdminAuth(false);
      setPassword("");
      router.push("/admin"); // 성공 시 관리자 페이지로 이동
    } else {
      alert("비밀번호가 일치하지 않습니다.");
      setPassword("");
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-24">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-4">설정</h2>

      {/* 설정 메뉴 리스트 */}
      <div className="space-y-3">
        <button 
          onClick={() => setShowContact(true)}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📞</span>
            <span className="font-semibold text-gray-800">담당자 조회</span>
          </div>
        </button>

        <button 
          onClick={() => setShowAdminAuth(true)}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-red-400 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚙️</span>
            <span className="font-semibold text-gray-800">관리자 모드 (매뉴얼 수정)</span>
          </div>
        </button>
      </div>

      {/* 1. 담당자 조회 팝업 (Modal) */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">비상연락망</h3>
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl mb-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">김동일 과장</span>
                <span className="font-bold text-gray-800">010-xxxx-xxxx</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">전기통신팀</span>
                <span className="font-bold text-gray-800">053-640-7895</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">칠곡전기주재</span>
                <span className="font-bold text-gray-800">053-640-7914</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500 text-sm">범물전기주재</span>
                <span className="font-bold text-gray-800">053-640-7981</span>
              </div>
            </div>
            <button 
              onClick={() => setShowContact(false)}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 2. 관리자 인증 팝업 (Modal) */}
      {showAdminAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">관리자 인증</h3>
            <p className="text-xs text-gray-500 mb-4">매뉴얼 수정 권한을 위해 비밀번호를 입력하세요.</p>
            
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            
            <div className="flex space-x-2">
              <button 
                onClick={() => { setShowAdminAuth(false); setPassword(""); }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl"
              >
                취소
              </button>
              <button 
                onClick={handleAdminLogin}
                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}