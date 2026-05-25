import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 flex justify-center min-h-screen">
        <div className="w-full max-w-md bg-white shadow-lg flex flex-col h-screen relative overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto pb-20 bg-gray-50">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}