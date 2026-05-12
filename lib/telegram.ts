const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
// Numeric IDs as reliable fallback (usernames can fail if entered without @)
const CHANNEL_RU = process.env.TELEGRAM_CHANNEL_RU ?? '-1003847617834';
const CHANNEL_UZ = process.env.TELEGRAM_CHANNEL_UZ ?? '-1003656113583';

export async function sendMessage(chatId: string, text: string): Promise<void> {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error: ${err}`);
  }
}

export async function broadcastBilingual(textRu: string, textUz: string): Promise<void> {
  await Promise.all([
    sendMessage(CHANNEL_RU, textRu),
    sendMessage(CHANNEL_UZ, textUz),
  ]);
}

// Deterministic daily index — same content on same day, cycles through array
export function dailyIndex(arr: unknown[], offsetDays = 0): number {
  const epoch = Math.floor(Date.now() / 86400000) + offsetDays;
  return epoch % arr.length;
}
