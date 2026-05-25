export default function Header() {
  const today = new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
  });

  return (
    <header className="bg-blue-600 text-white p-5 pt-6 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold tracking-wide">철도장비 스마트 관리체계</h1>
        <button className="p-1 focus:outline-none" aria-label="메뉴 열기">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <p className="text-sm opacity-90">{today}</p>
    </header>
  );
}