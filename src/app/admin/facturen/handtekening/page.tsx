'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import FactuurNav from '../FactuurNav';

export default function HandtekeningPage() {
  const router = useRouter();
  const [innerHtml, setInnerHtml] = useState('');
  const [plainText, setPlainText] = useState('');
  const [dark, setDark] = useState(false);
  const [okHtml, setOkHtml] = useState(false);
  const [okText, setOkText] = useState(false);
  const sigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/factuur/handtekening');
      if (res.status === 401) { router.push('/admin/facturen/login'); return; }
      const data = await res.json();
      setInnerHtml(data.innerHtml);
      setPlainText(data.plainText);
    })();
  }, [router]);

  async function copyHtml() {
    const el = sigRef.current;
    if (!el) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([el.innerHTML], { type: 'text/html' }),
        'text/plain': new Blob([el.innerText], { type: 'text/plain' }),
      })]);
      setOkHtml(true); setTimeout(() => setOkHtml(false), 2500);
    } catch {
      const range = document.createRange();
      range.selectNode(el);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      alert('Druk nu op Ctrl + C om te kopiëren (de handtekening is geselecteerd).');
    }
  }

  async function copyText() {
    try { await navigator.clipboard.writeText(plainText); } catch { /* */ }
    setOkText(true); setTimeout(() => setOkText(false), 2500);
  }

  const card = 'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6';
  const primary = 'px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium';

  return (
    <div className="min-h-screen bg-gray-50">
      <FactuurNav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">E-mailinstellingen</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Frisspits-handtekening</h1>
          <p className="mt-2 text-slate-600">Eén herkenbare handtekening voor je automatische factuurmails en overige correspondentie.</p>
        </div>

        <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
          <h2 className="font-bold">Automatisch toegevoegd aan factuurmails</h2>
          <p className="mt-1 text-sm text-emerald-800">Bij automatisch verzenden wordt onderstaande HTML-handtekening inclusief logo direct onder het bericht geplaatst. Je hoeft hem daarvoor niet apart in iCloud Mail in te stellen.</p>
        </section>

        <section className={card}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">Voorbeeld</h2>
            <button onClick={() => setDark(!dark)} className="text-sm text-sky-600 hover:underline">↔ achtergrond wisselen</button>
          </div>
          <p className="text-sm text-gray-500 mb-3">Zo ziet je handtekening eruit onder je e-mails.</p>
          <div className={`rounded-xl border border-gray-200 p-6 ${dark ? 'bg-[#2b2d30]' : 'bg-white'}`}>
            <div ref={sigRef} dangerouslySetInnerHTML={{ __html: innerHtml }} />
          </div>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Ook handmatig gebruiken</h2>
          <div className="flex items-center gap-3 mb-3">
            <button onClick={copyHtml} className={primary}>📋 Kopieer handtekening</button>
            {okHtml && <span className="text-green-600 font-semibold text-sm">✓ Gekopieerd!</span>}
          </div>
          <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1.5">
            <li>Klik hierboven op <b>Kopieer handtekening</b>.</li>
            <li>Open de handtekeninginstellingen van Apple Mail, iCloud Mail of je andere mailprogramma.</li>
            <li>Maak een handtekening met de naam <b>Frisspits</b>.</li>
            <li>Klik in het handtekeningvak en plak met <code className="bg-gray-100 px-1 rounded">Ctrl + V</code>.</li>
            <li>Koppel de handtekening aan <b>info@frisspits.nl</b> en sla de wijziging op.</li>
          </ol>
          <p className="text-xs text-gray-400 mt-3">Bij automatisch verzonden facturen wordt de complete versie altijd door het systeem toegevoegd.</p>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Platte-tekstversie</h2>
          <p className="text-sm text-gray-500 mb-3">Gebruik deze terugvalversie wanneer een mailprogramma geen opgemaakte handtekening accepteert.</p>
          <textarea readOnly rows={9} value={plainText}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 font-sans text-sm" />
          <div className="flex items-center gap-3 mt-3">
            <button onClick={copyText} className={primary}>📋 Kopieer tekst</button>
            {okText && <span className="text-green-600 font-semibold text-sm">✓ Gekopieerd!</span>}
          </div>
        </section>

        <section className={card}>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Op iPhone of iPad (Mail-app)</h2>
          <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1.5">
            <li><b>Op deze pc:</b> klik bovenaan op <b>Kopieer handtekening</b>.</li>
            <li><b>Op deze pc:</b> mail hem naar <b>je eigen adres</b> (plak met Ctrl + V) en verstuur.</li>
            <li><b>Op je iPhone:</b> open de <b>Mail</b>-app en open die mail.</li>
            <li>Houd je vinger op de handtekening → <b>Alles selecteren</b> → <b>Kopiëren</b>.</li>
            <li>Ga naar <b>Instellingen → Mail → Handtekening</b> en plak.</li>
            <li>Ziet het er kaal uit? <b>Schud je iPhone</b> en tik op <b>Ongedaan maken</b> — de opmaak komt terug.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
