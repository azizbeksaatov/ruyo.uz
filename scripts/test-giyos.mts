import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

console.log('Testing giyos insert...');
const { data, error } = await sb.from('names').upsert({
  slug: 'giyos', name: 'Ғиёс', gender: 'male', origin: 'arabic',
  meaning: 'Помощь, поддержка.', character: 'Надёжные люди.',
  meaning_uz: 'Yordam.', character_uz: 'Ishonchli odamlar.',
  lucky_numbers: [1, 5, 9], element: 'Огонь',
  compatible_names: [], popularity: 50, source: 'test', status: 'approved',
}, { onConflict: 'slug', ignoreDuplicates: false });
console.log('data:', data, 'error:', error);
console.log('Done');
process.exit(0);
