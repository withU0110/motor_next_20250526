import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nx = searchParams.get("nx");
  const ny = searchParams.get("ny");

  if (!nx || !ny) {
    return NextResponse.json({ error: "좌표가 없습니다." }, { status: 400 });
  }

  // 1. 기상청 업데이트 시간에 맞춘 안전한 날짜/시간 계산 로직
  const now = new Date();
  let baseTime = "0200";

  // 기상청 단기예보 02시 데이터는 통상 02시 10분 이후에 발표됩니다.
  // 따라서 현재 시간이 새벽 2시 15분 이전이라면, 어제 밤 11시(2300) 데이터를 요청해야 에러가 나지 않습니다.
  if (now.getHours() < 2 || (now.getHours() === 2 && now.getMinutes() < 15)) {
    now.setDate(now.getDate() - 1); // 날짜를 하루 전으로 뺌
    baseTime = "2300";
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const baseDate = `${year}${month}${day}`;

  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!apiKey) {
    console.error("🚨 [에러] .env.local 파일에 WEATHER_API_KEY가 설정되지 않았습니다.");
    return NextResponse.json({ error: "API 키 없음" }, { status: 500 });
  }

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${apiKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

  try {
    console.log(`\n📡 기상청 요청 중... (날짜: ${baseDate}, 시간: ${baseTime}, 좌표: ${nx}, ${ny})`);
    
    const response = await fetch(url);
    const textData = await response.text(); // JSON 파싱 전 텍스트로 먼저 받기 (XML 에러 방지)

    let data;
    try {
      data = JSON.parse(textData);
    } catch (e) {
      console.error("🚨 [기상청 에러] JSON 형태가 아닙니다. API 키가 잘못되었거나 승인 대기 중일 수 있습니다.");
      console.error("기상청 응답 원본:", textData.substring(0, 300));
      return NextResponse.json({ error: "API 키 오류 의심" }, { status: 500 });
    }

    if (data.response?.header?.resultCode !== "00") {
      console.error("🚨 [기상청 응답 에러 코드]:", data.response?.header?.resultCode);
      console.error("🚨 [기상청 응답 에러 메시지]:", data.response?.header?.resultMsg);
      return NextResponse.json({ error: data.response?.header?.resultMsg }, { status: 500 });
    }

    // 정상 응답일 경우 데이터 정제 (기존과 동일)
    const items = data.response?.body?.items?.item || [];
    const forecastMap: Record<string, any> = {};

    items.forEach((item: any) => {
      const fDate = item.fcstDate;
      if (!forecastMap[fDate]) {
        forecastMap[fDate] = { temps: [], sky: "1", pty: "0", tmn: null, tmx: null };
      }

      if (item.category === "TMP") forecastMap[fDate].temps.push(Number(item.fcstValue));
      if (item.category === "TMN") forecastMap[fDate].tmn = Math.round(Number(item.fcstValue));
      if (item.category === "TMX") forecastMap[fDate].tmx = Math.round(Number(item.fcstValue));
      
      // 낮 12시~3시 기상을 그날의 대표 기상으로 설정
      if (item.fcstTime === "1200" || item.fcstTime === "1400" || item.fcstTime === "1500") {
        if (item.category === "SKY") forecastMap[fDate].sky = item.fcstValue;
        if (item.category === "PTY") forecastMap[fDate].pty = item.fcstValue;
      }
    });

    const sortedDates = Object.keys(forecastMap).sort().slice(0, 5);
    const forecastList = sortedDates.map((dateStr) => {
      const dayData = forecastMap[dateStr];
      const minTemp = dayData.tmn !== null ? dayData.tmn : Math.min(...dayData.temps);
      const maxTemp = dayData.tmx !== null ? dayData.tmx : Math.max(...dayData.temps);

      return {
        date: dateStr,
        sky: dayData.sky,
        pty: dayData.pty,
        minTemp: isFinite(minTemp) ? Math.round(minTemp) : "--",
        maxTemp: isFinite(maxTemp) ? Math.round(maxTemp) : "--",
      };
    });

    console.log("✅ 기상청 날씨 데이터 로드 성공!");
    return NextResponse.json({ forecast: forecastList });
    
  } catch (error) {
    console.error("🚨 [서버 내부 에러]:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}