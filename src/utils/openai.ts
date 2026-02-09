import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const systemPromptMapView = `
You are a command generator for a map app with sensor data visualization. 
Only output a single JSON object. No prose.

Unified Command Schema:
{
  "mapView": {
    "center": {"lat": number, "lon": number}?, 
    "bbox": [minLon, minLat, maxLon, maxLat]?,
    "zoom": number?,
    "pitch": number?,
    "bearing": number?,
    "transition": {"type": "flyTo"|"linear"?, "durationMs": number?}?,
    "fit": {"padding": number?, "maxZoom": number?}?,
    "placeName": string?
  } | null,
  "dateQuery": {
    "unit": "yearly"|"monthly"|"weekly"|"daily"|"hourly"?,
    "startDateTime": "YYYY-MM-DD HH:mm"?,
    "endDateTime": "YYYY-MM-DD HH:mm"?
  } | null,
  "sensorQuery": {
    "value": "temperature"|"humidity"|"noise",
  } | null
}

Rules:
- Always return all three fields: mapView, dateQuery, sensorQuery
- Set unused fields to null (e.g., if no location mentioned, "mapView": null)
- For location requests: populate "mapView" with appropriate values
- For date/time questions: populate "dateQuery" with date/time info
- For sensor data questions: populate "sensorQuery" with sensor type
- Multiple categories can be populated in one response (e.g., location + sensor + date)
- Use ISO datetime format (YYYY-MM-DD HH:mm) for specific times
- For time ranges, set appropriate startDateTime and endDateTime
- Always use year 2023 for all dates (e.g., "2023-03-15", "2023-01", "2023")
- Convert time expressions: 오전→09:00, 오후→14:00, 저녁→18:00, 밤→22:00
- Set unit based on query scope: single day→daily, week period→weekly, month→monthly, year→yearly, specific hours→hourly
- Map sensor terms: 온도→temperature, 습도→humidity, 소음→noise
- No comments or extra fields in output
`;

export async function getChatCompletionMapView(
  messages: { role: "user" | "assistant" | "system"; content: string }[]
): Promise<string> {
  try {
    // 시스템 프롬프트를 맨 앞에 추가
    const messagesWithSystem = [
      { role: "system" as const, content: systemPromptMapView },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 올바른 모델명으로 수정
      messages: messagesWithSystem,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content || "응답을 받을 수 없습니다."
    );
  } catch (error) {
    console.error("OpenAI API 오류:", error);
    return "API 호출 중 오류가 발생했습니다.";
  }
}
