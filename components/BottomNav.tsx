import Link from "next/link";

export default function BottomNav() {
  const tabs = [
    { label: "홈", icon: "🏠", path: "/" },
    { label: "요약도", icon: "📊", path: "/summary" },
    { label: "조치방법", icon: "⚠️", path: "/action" },
    { label: "매뉴얼", icon: "📖", path: "/menu/all" },
    { label: "설정", icon: "⚙️", path: "/settings" },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-50">
      {tabs.map((tab, idx) => (
        <Link key={idx} href={tab.path} className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600">
          <span className="text-xl mb-0.5">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}