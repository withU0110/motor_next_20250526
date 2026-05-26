"use client";

import { useEffect, useState } from "react";
import { convertToGrid, getWeatherEmoji } from "@/lib/weatherUtils";

interface ForecastItem {
  date: string;
  sky: string;
  pty: string;
  minTemp: number | string;
  maxTemp: number | string;
}

export default function WeatherWidget() {
  const [currentWeather, setCurrentWeather] = useState({ temp: "--", emoji: "☀️" });
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 날짜 문자열을 "00일/요일" 형태로 변환하는 헬퍼 함수
  const formatDayLabel = (dateStr: string) => {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const dateObj = new Date(year, month, day);
    
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${day}일/${dayNames[dateObj.getDay()]}`;
  };

useEffect(() => {
    // 날씨 API를 호출하는 공통 함수
    const fetchWeather = async (nx: number, ny: number) => {
      // 🚨 [핵심 방어 코드] 변환된 좌표가 NaN(오류값)이면 강제로 대구 중구(89, 90)를 사용
      const safeNx = (!nx || Number.isNaN(nx)) ? 89 : nx;
      const safeNy = (!ny || Number.isNaN(ny)) ? 90 : ny;

      try {
        const res = await fetch(`/api/weather?nx=${safeNx}&ny=${safeNy}`);
        const data = await res.json();
        
        if (data.forecast && data.forecast.length > 0) {
          setCurrentWeather({
            temp: String(data.forecast[0].maxTemp),
            emoji: getWeatherEmoji(data.forecast[0].pty, data.forecast[0].sky)
          });
          setForecast(data.forecast);
        }
      } catch (error) {
        console.error("날씨 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      // GPS 미지원 브라우저
      fetchWeather(89, 90);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // GPS 성공 시
        const { latitude, longitude } = position.coords;
        const grid = convertToGrid(latitude, longitude);
        
        // grid.nx, grid.ny가 NaN으로 나오더라도 fetchWeather 내부에서 방어됨
        fetchWeather(grid.nx, grid.ny);
      },
      (error) => {
        // GPS 권한 거부되거나 시간 초과 시
        console.warn("GPS 권한 거부/실패로 기본 좌표(대구 중구)를 사용합니다.");
        fetchWeather(89, 90);
      },
      { timeout: 5000 }
    );
  }, []);

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-5">
      {/* 1층: 현재 날씨 상태 */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm font-medium">현재 기온</p>
          <div className="text-4xl font-extrabold text-blue-600">
            {loading ? "..." : `${currentWeather.temp}°C`}
          </div>
        </div>
        <div className="text-5xl">{currentWeather.emoji}</div>
      </div>

      {/* 2층: 5일 예보 레이아웃 (빨간색 박스 영역 반영) */}
      <div className="border-t pt-4">
        <p className="text-gray-400 text-xs font-semibold mb-3">주간 예보 (5일)</p>
        <div className="grid grid-cols-5 gap-1 text-center bg-gray-50 p-3 rounded-2xl">
          {loading ? (
            <div className="col-span-5 text-gray-400 text-xs py-4">날씨 데이터를 불러오는 중...</div>
          ) : (
            forecast.map((day) => (
              <div key={day.date} className="flex flex-col items-center space-y-1">
                {/* 1단: 00일/요일 */}
                <span className="text-[11px] font-bold text-gray-600 whitespace-nowrap">
                  {formatDayLabel(day.date)}
                </span>
                {/* 2단: 날씨 이모지 */}
                <span className="text-xl py-0.5">
                  {getWeatherEmoji(day.pty, day.sky)}
                </span>
                {/* 3단: 최저/최고온도 */}
                <span className="text-[10px] text-gray-500 font-medium">
                  <span className="text-blue-500">{day.minTemp}°</span>/
                  <span className="text-red-500">{day.maxTemp}°</span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}