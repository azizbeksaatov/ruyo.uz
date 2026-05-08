import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')?.trim();
  const locale = req.nextUrl.searchParams.get('locale') ?? 'ru';

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI lookup not configured' }, { status: 503 });
  }

  const lang = locale === 'uz' ? "o'zbek" : 'русском';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(
      `Ты — эксперт по именам. Найди информацию об имени "${name}". Ответь на ${lang} языке в JSON формате (без markdown):
{
  "exists": true/false,
  "name": "имя как пишется правильно",
  "gender": "male/female/unisex",
  "origin": "одно из: uzbek/arabic/persian/turkic/slavic/greek/latin/hebrew/scandinavian/other",
  "meaning": "значение имени (2-3 предложения)",
  "character": "описание характера носителя имени (2-3 предложения)",
  "luckyNumbers": [число1, число2, число3],
  "element": "Огонь/Земля/Вода/Воздух"
}
Если имя не существует или не является настоящим именем — верни {"exists": false}.`
    );

    const text = result.response.text();
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }
}
