import Link from "next/link";

// 1. 각 계통별 문제점 리스트 데이터 (코드 내 배열로 관리)
const categoryData: Record<string, { title: string; evils: { id: string; name: string }[] }> = {
  emergency: {
    title: "구동계통",
    evils: [
      { id: "e1", name: "[안내륜/안정륜] 소음 및 발열" },
      { id: "e2", name: "[주행륜/타이어]" },
      { id: "e3", name: "[기타구동문제]" }
    ]
  },
  caution: {
    title: "공압계통",
    evils: [
      { id: "c1", name: "[제동공기압] 공기압누설" },
      { id: "c2", name: "[제동공기압] 공압라인 이상" },
      { id: "c3", name: "[솔레노이드/서보모터]" },
      { id: "c4", name: "[컴프레셔]" }
    ]
  },
  contact: {
    title: "제어계통",
    evils: [
      { id: "ct1", name: "[전기부품] 콘센트열화" },
      { id: "ct2", name: "[전기부품] 단상인버터 출력이상" },
      { id: "ct3", name: "[PLC]" },
      { id: "ct4", name: "[충전기]" },
      { id: "ct5", name: "[통신분야]" }
    ]
  },
  prevention: {
    title: "기타분야",
    evils: [
      { id: "p1", name: "[영상모니터]]" },
      { id: "p2", name: "[CCTV]]" },
      { id: "p3", name: "[증류수제조기]" }
    ]
  }
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const data = categoryData[category];

  // 잘못된 주소로 접근했을 때의 예외 처리
  if (!data) {
    return (
      <div className="p-4 text-center space-y-4 mt-10">
        <p className="text-gray-500">존재하지 않는 계통 카테고리입니다.</p>
        <Link href="/" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg">
          메인으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto pb-12">
      {/* 상단 헤더 영역 (뒤로가기 + 타이틀) */}
      <div className="flex items-center space-x-3 border-b pb-4">
        {/* 뒤로가기 버튼: 메인 홈('/')으로 이동 */}
        <Link href="/" className="text-gray-400 hover:text-gray-800 text-2xl font-bold px-1 transition-colors">
          ←
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
        <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-md">
          문제 목록
        </span>
      </div>

      {/* 문제점 목록 리스트 */}
      <div className="space-y-3">
        {data.evils.map((item) => (
          <Link 
            key={item.id} 
            href={`/manual/${category}/${item.id}`} // 상세 내용 페이지로 이동
            className="block p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 text-base">{item.name}</span>
              <span className="text-gray-300 font-bold">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}