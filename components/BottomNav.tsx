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
    // 💡 absolute 위치 속성을 제거하고, w-full flex-shrink-0를 넣어 바닥에 자연스럽게 안착시킵니다.
    <nav className="w-full flex-shrink-0 bg-white border-t border-gray-200 h-20 flex z-50">
      {tabs.map((tab, idx) => {
        const isActive = pathname === tab.path;
        return (
          <Link 
            key={idx} 
            href={tab.path} 
            className={`flex-1 flex flex-col items-center justify-center h-full transition-colors ${
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-[11px] font-bold whitespace-nowrap">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}