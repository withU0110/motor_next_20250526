"use client";

export default function Splash() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-blue-600 animate-fadeIn">
      <div className="relative w-40 h-40 animate-pulse">
        <img 
          src="/logo.png" 
          alt="Company Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <p className="mt-4 text-white font-bold text-lg tracking-widest">
        철도장비 스마트 관리체계
      </p>
    </div>
  );
}