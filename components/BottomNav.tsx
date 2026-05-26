"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "홈", icon: "🏠", path: "/" },
    { label: "요약도", icon: "🖼", path: "/summary" },
    { label: "조치방법", icon: "⚠️", path: "/action" },
    { label: "참고자료", icon: "📖", path: "/references/all" },
    { label: "설정", icon: "⚙️", path: "/settings" },
  ];

  return (
    // 1. fixed 대신 기존의 absolute로 원복하여 모바일 컨테이너 안에 가둡니다.
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex z-50">
      {tabs.map((tab, idx) => {
        const isActive = pathname === tab.path;
        return (
          <Link 
            key={idx} 
            href={tab.path} 
            // 2. w-full 대신 flex-1을 사용하여 5개의 메뉴가 정확히 동일한 비율(20%)로 공간을 나누어 가지도록 설정합니다.
            className={`flex-1 flex flex-col items-center justify-center h-full transition-colors ${
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            {/* 3. 글씨가 두 줄로 깨지지 않도록 whitespace-nowrap 적용, 폰트 크기 모바일 최적화 */}
            <span className="text-[11px] font-bold whitespace-nowrap">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}