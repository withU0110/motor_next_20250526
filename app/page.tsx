import Link from "next/link";

export default function HomePage() {
  const quickMenus = [
    { title: "구동계통", path: "emergency", color: "bg-red-500" },
    { title: "공압계통", path: "caution", color: "bg-yellow-500" },
    { title: "제어계통", path: "contact", color: "bg-blue-500" },
    { title: "기타분야", path: "prevention", color: "bg-green-500" },
  ];

  return (
    <div className="p-4 space-y-8">
      {/* 날씨 섹션 */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">현재 날씨</p>
          <div className="text-4xl font-bold text-blue-600">24°C</div>
        </div>
        <div className="text-5xl">☀️</div>
      </div>

      {/* 요약도 버튼 */}
      <Link href="/summary" className="block w-full bg-blue-600 text-white font-bold text-center py-5 rounded-3xl shadow-lg hover:bg-blue-700 transition-all">
        요약도 보기 →
      </Link>

      {/* 그룹화된 메뉴 섹션 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">응급시 조치방법</h2>
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
            {quickMenus.map((menu) => (
                <Link key={menu.title} href={`/menu/${menu.path}`} 
                className={`${menu.color} text-white p-6 rounded-2xl h-28 flex flex-col justify-end shadow-sm hover:scale-105 transition-transform`}>
                <span className="font-bold text-base">{menu.title}</span>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}