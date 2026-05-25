// app/menu/[category]/page.tsx
export default function MenuPage({ params }: { params: { category: string } }) {
  const items = ["일반 조치사항 1", "일반 조치사항 2", "주의사항 확인", "관리 매뉴얼"];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 capitalize">{params.category}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
            <span className="font-medium">{item}</span>
            <span className="text-gray-400">〉</span>
          </div>
        ))}
      </div>
    </div>
  );
}