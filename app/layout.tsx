import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header"; // 💡 기존에 Header 컴포넌트가 있다면 활성화

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 text-gray-900">
        {/* 전체 앱을 모바일 크기로 가두고, 화면 전체 높이(100dvh)로 고정하여 바깥 스크롤 방지 */}
        <div className="max-w-md mx-auto bg-white h-[100dvh] flex flex-col relative overflow-hidden shadow-2xl">
          
          {/* 상단 고정: 헤더 (Header 컴포넌트) */}
          <Header />

          {/* 중앙 가변 영역: 내용물이 길어지면 이 영역 안에서만 독립적으로 스크롤됨 */}
          <main className="flex-1 overflow-y-auto scrollbar-hide">
            {children}
          </main>

          {/* 하단 고정: 네비게이션 바 */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}