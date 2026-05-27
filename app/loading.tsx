export default function Loading() {
  return (
    // 배경을 하얗게 채우고 화면 중앙에 로딩 스피너를 배치합니다.
    <div className="w-full min-h-screen bg-white max-w-md mx-auto flex flex-col items-center justify-center pb-20">
      <div className="flex flex-col items-center space-y-4">
        {/* 빙글빙글 도는 애니메이션 원형 */}
        <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
        {/* 안내 문구 */}
        <p className="text-gray-500 font-bold text-sm animate-pulse">
          데이터를 불러오는 중입니다...
        </p>
      </div>
    </div>
  );
}