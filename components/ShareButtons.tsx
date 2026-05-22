'use client';

import { useState } from 'react';

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function VkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.335-3.205-2.17-3.05-2.76-5.34-2.76-5.803 0-.254.102-.491.593-.491H6.37c.44 0 .61.203.78.677.864 2.49 2.305 4.675 2.9 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.185-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.204.508.643v3.459c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.17-3.607 2.17-3.607.118-.254.322-.491.762-.491h1.744c.525 0 .644.27.525.643-.22 1.168-2.37 4.065-2.37 4.065-.186.305-.254.44 0 .78.186.254.796.78 1.202 1.253.745.847 1.32 1.558 1.473 2.05.136.491-.11.745-.576.745z" />
    </svg>
  );
}

function OkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
      <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm0 4.5c1.864 0 3.375 1.51 3.375 3.375S13.864 11.25 12 11.25 8.625 9.74 8.625 7.875 10.136 4.5 12 4.5zm5.813 9.262c-.6.574-1.337.965-2.138 1.148l2.125 2.125a.938.938 0 0 1-1.326 1.326L14 15.887l-2.475 2.474a.938.938 0 0 1-1.326-1.326l2.124-2.124a6.05 6.05 0 0 1-2.136-1.148 6.068 6.068 0 0 1-2.049-4.513.937.937 0 1 1 1.875 0 4.2 4.2 0 0 0 4.2 4.2 4.2 4.2 0 0 0 4.2-4.2.937.937 0 1 1 1.875 0 6.07 6.07 0 0 1-2.475 4.512z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.416-8.49-7.83-10.71h7.544l4.25 5.622L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12c0 3.259.014 3.668.072 4.948.059 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.058 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.059-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );
}

interface Props {
  url: string;
  title: string;
  locale?: string;
}

export default function ShareButtons({ url, title, locale }: Props) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const handleInstagramClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const shareLabel = locale === 'uz' ? 'Ulashing:' : 'Поделиться:';
  const copiedLabel = locale === 'uz' ? 'Nusxalandi!' : 'Скопировано!';

  const links = [
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${enc(url)}&text=${enc(title)}`,
      icon: <TelegramIcon />,
      hoverColor: 'hover:text-[#0088cc]',
    },
    {
      name: 'VKontakte',
      href: `https://vk.com/share.php?url=${enc(url)}&title=${enc(title)}`,
      icon: <VkIcon />,
      hoverColor: 'hover:text-[#0077ff]',
    },
    {
      name: 'Одноклассники',
      href: `https://connect.ok.ru/offer?url=${enc(url)}&title=${enc(title)}`,
      icon: <OkIcon />,
      hoverColor: 'hover:text-[#ed812b]',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      icon: <FacebookIcon />,
      hoverColor: 'hover:text-[#1877f2]',
    },
    {
      name: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
      icon: <XIcon />,
      hoverColor: 'hover:text-black',
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap pt-4">
      <span className="text-sm text-stone-400 shrink-0">{shareLabel}</span>
      <div className="flex items-center gap-2">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.name}
            className={`w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 text-stone-500 transition-colors hover:bg-stone-200 ${link.hoverColor}`}
          >
            {link.icon}
          </a>
        ))}
        <button
          onClick={handleInstagramClick}
          title="Instagram"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-stone-100 text-stone-500 hover:text-[#e1306c] hover:bg-stone-200 transition-colors"
        >
          <InstagramIcon />
          {copied && (
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs bg-stone-800 text-white px-2 py-1 rounded-lg whitespace-nowrap z-10">
              {copiedLabel}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
