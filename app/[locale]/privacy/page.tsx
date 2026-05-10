import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — Ruyo.uz',
  description: 'Политика конфиденциальности сайта Ruyo.uz. Мы уважаем вашу приватность и защищаем ваши данные.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">Политика конфиденциальности</h1>
      <p className="text-stone-500 text-sm mb-10">Последнее обновление: 1 мая 2026 года</p>

      <div className="prose prose-stone max-w-none space-y-8">

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">1. Общие положения</h2>
          <p className="text-stone-600 leading-relaxed">
            Настоящая Политика конфиденциальности описывает, как сайт Ruyo.uz (далее — «Сайт», «мы», «нас») собирает, использует и защищает информацию, которую вы предоставляете при использовании нашего сервиса. Используя Сайт, вы соглашаетесь с условиями данной Политики.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">2. Какие данные мы собираем</h2>
          <p className="text-stone-600 leading-relaxed mb-3">
            Мы собираем минимально необходимый объём данных:
          </p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2">
            <li><strong>Данные об использовании сайта</strong> — страницы, которые вы посещаете, время сессии, технические параметры браузера и устройства. Эти данные обрабатываются в анонимизированном виде.</li>
            <li><strong>Данные форм</strong> — если вы отправляете заявку через форму (например, предлагаете новое имя для раздела «Имена»), мы сохраняем введённые вами данные для обработки.</li>
            <li><strong>Данные AI-интерпретатора</strong> — запросы к AI-сервису (интерпретация снов, личный гороскоп) обрабатываются через API Google Gemini. Мы не сохраняем текст ваших запросов на своих серверах.</li>
            <li><strong>Файлы cookie</strong> — мы используем технические cookie для корректной работы сайта, а также cookie третьих сторон (Google Analytics, Google AdSense).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">3. Как мы используем данные</h2>
          <ul className="list-disc pl-6 text-stone-600 space-y-2">
            <li>Обеспечение работы и улучшение функциональности Сайта.</li>
            <li>Анализ посещаемости и поведения пользователей (в анонимном виде) для улучшения контента.</li>
            <li>Показ релевантной рекламы через сервис Google AdSense.</li>
            <li>Обработка запросов, отправленных через формы на сайте.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">4. Сторонние сервисы</h2>
          <p className="text-stone-600 leading-relaxed mb-3">Мы используем следующие сторонние сервисы, у каждого из которых есть собственная политика конфиденциальности:</p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2">
            <li><strong>Google Analytics</strong> — анализ посещаемости. Данные анонимизированы.</li>
            <li><strong>Google AdSense</strong> — показ рекламных объявлений. Google может использовать cookie для персонализации рекламы.</li>
            <li><strong>Google Gemini API</strong> — AI-интерпретация снов и персональный гороскоп.</li>
            <li><strong>Supabase</strong> — хранение данных из пользовательских форм (предложения имён).</li>
            <li><strong>Vercel</strong> — хостинг и доставка контента (CDN).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">5. Файлы cookie</h2>
          <p className="text-stone-600 leading-relaxed">
            Мы используем cookie для обеспечения работы Сайта и аналитики. Вы можете отключить cookie в настройках вашего браузера, однако это может повлиять на функциональность некоторых разделов Сайта. Google AdSense может использовать cookie и схожие технологии для показа персонализированной рекламы на основе ваших предыдущих посещений данного и других сайтов.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">6. Хранение данных</h2>
          <p className="text-stone-600 leading-relaxed">
            Мы не продаём, не обмениваем и не передаём ваши персональные данные третьим лицам, за исключением случаев, предусмотренных настоящей Политикой (сторонние сервисы, перечисленные выше). Данные хранятся в защищённой среде и удаляются, когда они больше не нужны.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">7. Права пользователей</h2>
          <p className="text-stone-600 leading-relaxed mb-3">
            Вы имеете право:
          </p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2">
            <li>Запросить информацию о данных, которые мы храним о вас.</li>
            <li>Потребовать исправления или удаления ваших данных.</li>
            <li>Отозвать согласие на обработку данных, направив запрос на наш email.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">8. Контакты</h2>
          <p className="text-stone-600 leading-relaxed">
            По вопросам конфиденциальности обращайтесь: <strong>info@ruyo.uz</strong>. Мы стараемся отвечать на запросы в течение 5 рабочих дней.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-3">9. Изменения политики</h2>
          <p className="text-stone-600 leading-relaxed">
            Мы можем периодически обновлять данную Политику. Актуальная версия всегда доступна на этой странице. Продолжение использования Сайта после внесения изменений означает ваше согласие с обновлённой Политикой.
          </p>
        </section>

        <div className="mt-10 pt-6 border-t border-stone-100 text-center">
          <Link href="/" className="text-violet-600 hover:text-violet-700 text-sm font-medium">
            ← Вернуться на главную
          </Link>
        </div>

      </div>
    </div>
  );
}
