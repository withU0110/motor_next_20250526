"use client";

import { useState, useEffect } from "react";
import Splash from "@/components/Splash";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 2초(2000ms) 동안 스플래시를 보여준 뒤 메인 화면으로 전환합니다.
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="ko">
      <body className="bg-gray-100">
        <div className="max-w-md mx-auto bg-white h-[100dvh] flex flex-col relative overflow-hidden shadow-2xl">
          
          {/* 스플래시가 켜져있을 때만 화면의 가장 윗단에 덮습니다 */}
          {showSplash && <Splash />}
          
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <BottomNav />
          
        </div>
      </body>
    </html>
  );
}