import type { Metadata } from 'next';
import Link from 'next/link';
import { Send } from 'lucide-react';

export const metadata: Metadata = {
  title: 'О сайте — Ruyo.uz | Сонник и гороскоп',
  description: 'Ruyo.uz — ведущий сайт о снах, гороскопах и значении имён для Узбекистана и СНГ. Узнайте о нашей миссии и команде.',
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <div className="text-center mb-12">
        <span className="text-6xl mb-5 block">🌙</span>
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-4">О сайте Ruyo.uz</h1>
        <p className="text-stone-500 text-lg leading-relaxed">
          Ваш проводник в мире снов, астрологии и значения имён
        </p>
      </div>

      <div className="space-y-10">

        {/* Mission */}
        <section className="bg-white rounded-2xl border border-stone-200 p-8">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">Наша миссия</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            Ruyo.uz — это бесплатный онлайн-ресурс на русском и узбекском языках, посвящённый толкованию снов, астрологии и значению имён. Наша цель — помочь жителям Узбекистана и стран СНГ лучше понять себя через призму снов, гороскопов и культурных традиций.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Мы верим, что сны — это язык подсознания, а гороскопы — инструмент саморефлексии. Не претендуя на научную достоверность, мы предоставляем обширную базу знаний, собранную из множества источников и дополненную современными AI-технологиями.
          </p>
        </section>

        {/* What we offer */}
        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-6">Что вы найдёте на сайте</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { emoji: '📖', title: 'Сонник', desc: 'Более 500 толкований снов по Миллеру, Ванге, Фрейду и другим источникам. Значение для мужчин и женщин, по дням недели.' },
              { emoji: '⭐', title: 'Гороскоп', desc: '12 знаков зодиака: ежедневный, недельный, месячный гороскоп. Любовный гороскоп и совместимость знаков.' },
              { emoji: '🤖', title: 'AI-интерпретация', desc: 'Персональное толкование вашего сна с помощью искусственного интеллекта (Google Gemini). Введите ваш сон — получите развёрнутый ответ.' },
              { emoji: '🌸', title: 'Значение имён', desc: 'Более 70 имён — узбекских, арабских, русских. История происхождения, значение, характер, совместимость.' },
              { emoji: '🧪', title: 'Психологические тесты', desc: 'Вирусные тесты для самопознания. Узнайте свой архетип, тип личности или совместимость с партнёром.' },
              { emoji: '📊', title: 'Личный гороскоп', desc: 'Персональный гороскоп по дате рождения с AI-анализом. Введите свои данные — получите индивидуальный прогноз.' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-stone-200 rounded-xl p-5">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-amber-50 border border-amber-100 rounded-2xl p-8">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">Важное предупреждение</h2>
          <p className="text-stone-600 leading-relaxed">
            Весь контент на Ruyo.uz носит <strong>исключительно развлекательный и информационный характер</strong>. Толкования снов, гороскопы и астрологические прогнозы не являются научными утверждениями и не могут служить основанием для принятия важных жизненных решений. По всем серьёзным вопросам обращайтесь к профильным специалистам — психологам, врачам, юристам.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-white rounded-2xl border border-stone-200 p-8">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-4">Связаться с нами</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            Мы открыты для обратной связи, предложений и сотрудничества. Если вы обнаружили ошибку, хотите предложить новый контент или заинтересованы в партнёрстве — пишите нам.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-stone-600">
              <span className="text-xl">📧</span>
              <span>info@ruyo.uz</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <span className="text-xl">📍</span>
              <span>Ташкент, Узбекистан</span>
            </div>
            <a
              href="https://t.me/ruyo_uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors mt-2"
            >
              <Send className="w-4 h-4" />
              Telegram: @ruyo_uz
            </a>
          </div>
        </section>

        <div className="text-center">
          <Link href="/" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
