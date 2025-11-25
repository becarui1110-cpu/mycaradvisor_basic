"use client";

import { useEffect, useMemo, useState } from "react";
import App from "./App";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

  // ===== TIMER TOKEN (60 min) =====
  const TOKEN_DURATION_SEC = 60 * 60; // 60 minutes

  // on fixe l’instant de départ au montage
  const [startedAt] = useState<number>(() => Date.now());
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingSec = useMemo(() => {
    const elapsed = Math.floor((now - startedAt) / 1000);
    return Math.max(TOKEN_DURATION_SEC - elapsed, 0);
  }, [now, startedAt]);

  const tokenExpired = remainingSec <= 0;

  const formatRemaining = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-50 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            {/* pastille Basic (vert émeraude) */}
            <div className="h-8 w-8 rounded-full bg-emerald-400/90" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-300">
                MyCarAdvisor
              </p>
              <p className="text-sm sm:text-base font-semibold">
                Agent IA <span className="text-emerald-300">Basic</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden xs:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[11px] border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Actif
            </span>
            {/* bouton infos (mobile) */}
            <button
              onClick={() => setInfoOpen((v) => !v)}
              className="md:hidden rounded-lg border border-slate-700 px-3 py-1.5 text-xs bg-slate-900"
              aria-expanded={infoOpen}
              aria-controls="mobile-info"
            >
              {infoOpen ? "Masquer" : "Infos"}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-3 sm:px-4 py-4 sm:py-6 grid grid-cols-1 md:grid-cols-[1.1fr_0.55fr] gap-4 sm:gap-6">
        {/* Chat panel */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-xl sm:rounded-2xl min-h-[420px] sm:min-h-[520px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-800">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold">
                Votre assistant Basic
              </h1>
              <p className="text-[12px] sm:text-sm text-slate-400 truncate">
                Posez vos questions simples sur la fiabilité, l’entretien et la consommation.
              </p>
            </div>
            <button
              onClick={() => setIsChatOpen((p) => !p)}
              className="text-xs border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg bg-slate-900"
            >
              {isChatOpen ? "Masquer" : "Afficher"}
            </button>
          </div>

          <div className="flex-1 min-h-[360px] sm:min-h-[430px] bg-slate-950/30">
            {isChatOpen ? (
              <App />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm py-10">
                Chat masqué. Cliquez sur “Afficher”.
              </div>
            )}
          </div>
        </section>

        {/* Right panel (desktop) */}
        <aside className="hidden md:block space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">Informations d’accès</h2>
            <p className="text-sm text-slate-400">
              Vous utilisez un lien d’accès temporaire. Une fois expiré, il faudra en demander un nouveau.
            </p>
            <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">Durée du lien</p>

              {/* ✅ TIMER DESKTOP */}
              <p
                className={`text-base font-semibold ${
                  tokenExpired ? "text-rose-300" : "text-slate-50"
                }`}
              >
                {tokenExpired ? "Expiré" : formatRemaining(remainingSec)}
              </p>

              <p className="text-xs text-slate-500">Le contrôle d’expiration est géré côté serveur.</p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">Besoin d’aide ?</h2>
            <p className="text-sm text-slate-400">
              Si le chat ne s’affiche pas ou si votre lien a expiré, retournez sur{" "}
              <span className="text-slate-100">mycaradvisor.ch</span> pour générer un nouvel accès.
            </p>
            <a
              href="https://mycaradvisor.ch"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-400 text-slate-950 text-sm font-medium px-4 py-2 hover:bg-emerald-300 transition"
            >
              Retourner sur le site
            </a>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/15 to-slate-900/0 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200 mb-1">Basic activé</p>
            <p className="text-sm text-slate-100">Accès aux fonctionnalités essentielles de l’agent.</p>
          </div>
        </aside>

        {/* Info panel (mobile) */}
        <section
          id="mobile-info"
          className={`md:hidden col-span-1 transition-[max-height,opacity] duration-300 overflow-hidden ${
            infoOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">Infos d’accès</h2>
            <p className="text-sm text-slate-400">Lien temporaire — demandez un nouveau lien si besoin.</p>
            <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">Durée</p>

              {/* ✅ TIMER MOBILE */}
              <p
                className={`text-sm font-semibold ${
                  tokenExpired ? "text-rose-300" : "text-slate-50"
                }`}
              >
                {tokenExpired ? "Expiré" : formatRemaining(remainingSec)}
              </p>
            </div>
            <a
              href="https://mycaradvisor.ch"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-400 text-slate-950 text-sm font-medium px-4 py-2 hover:bg-emerald-300 transition w-full"
            >
              Retourner sur le site
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
