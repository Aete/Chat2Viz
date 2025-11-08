import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const systemPromptMapView = `
You are a command generator for a map app (deck.gl). 
Only output a single JSON object. No prose.
Schema:
{
  "type": "setView",
  "payload": {
    "center": {"lat": number, "lon": number}?, 
    "bbox": [minLon, minLat, maxLon, maxLat]?,
    "zoom": number?,
    "pitch": number?,
    "bearing": number?,
    "transition": {"type": "flyTo"|"linear"?, "durationMs": number?}?,
    "fit": {"padding": number?, "maxZoom": number?}?,
    "placeName": string?
  }
}
Rules:
- If the user mentions a place name (e.g., "서울역"), use "placeName".
- If they request “서울 전체가 보이되 최대한 줌인”, prefer "bbox" (city bounds) + {"fit":{"maxZoom":14~15}}.
- Use meters/seconds-free values. Do not include comments or extra fields.
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
