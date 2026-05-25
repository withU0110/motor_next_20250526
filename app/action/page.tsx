import Link from "next/link";

export default function ActionPage() {
  const menus = [
    { title: "구동계통", path: "emergency", color: "bg-red-500" },
    { title: "공압계통", path: "caution", color: "bg-yellow-500" },
    { title: "제어계통", path: "contact", color: "bg-blue-500" },
    { title: "기타분야", path: "prevention", color: "bg-green-500" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">응급 조치 방법</h2>
      <div className="grid grid-cols-2 gap-2">
        {menus.map((menu) => (
          <Link key={menu.title} href={`/menu/${menu.path}`} 
            className={`${menu.color} text-white p-6 rounded-2xl h-32 flex flex-col justify-end shadow-md hover:scale-105 transition-transform`}>
            <span className="font-bold text-lg">{menu.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}