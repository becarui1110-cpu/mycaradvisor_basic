// app/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import App from "./App";

const LINK_TTL_MINUTES = 60; // durée totale du lien MyCar Basic (pour l'affichage/progression)

type TimeParts = {
  hours: string;
  minutes: string;
  seconds: string;
};

function computeTimeParts(ms: number): TimeParts {
  if (ms <= 0) return { hours: "00", minutes: "00", seconds: "00" };

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, "0"),
    minutes: minutes.toString().padStart(2, "0"),
    seconds: seconds.toString().padStart(2, "0"),
  };
}

function HomeInner() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(false);

  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // 1) Lire l'expiration depuis le token (ts = expiresAt en ms)
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    const [tsStr] = token.split(".");
    const exp = Number(tsStr);

    if (!Number.isFinite(exp)) return;

    // ✅ IMPORTANT : dans Basic, le ts est déjà expiresAt
    setExpiresAt(exp);
  }, [searchParams]);

  // 2) Compte à rebours + redirection quand expiré
  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setRemainingMs(0);
        router.push("/expired");
        return;
      }
      setRemainingMs(diff);
    };

    update(); // calcul initial immédiat
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, router]);

  const totalMs = LINK_TTL_MINUTES * 60 * 1000;
  const progress =
    remainingMs == null
      ? 1
      : Math.max(0, Math.min(1, remainingMs / totalMs));

  const timeParts = computeTimeParts(remainingMs ?? totalMs);
  const hasData = remainingMs !== null;

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
                Posez vos questions simples sur la fiabilité, l’entretien et la
                consommation.
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
          {/* Widget compte à rebours */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Informations d’accès
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Lien sécurisé
              </span>
            </div>

            <p className="text-sm text-slate-400">
              Vous utilisez un lien d’accès temporaire. Une fois expiré, il
              faudra en demander un nouveau.
            </p>

            {/* Widget digital */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Temps restant avant expiration
                </p>
                <p className="text-[11px] text-slate-500">
                  Durée totale : {LINK_TTL_MINUTES} minutes
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                {/* chiffres */}
                <div className="flex items-center justify-center gap-2 font-mono">
                  <div className="flex flex-col items-center">
                    <div className="min-w-[3.2rem] text-center text-2xl md:text-3xl font-semibold bg-slate-900/90 border border-slate-700 rounded-lg px-2 py-1 shadow-sm">
                      {hasData ? timeParts.hours : "--"}
                    </div>
                    <span className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                      Heures
                    </span>
                  </div>

                  <div className="text-xl md:text-2xl text-slate-500 pb-4">
                    :
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="min-w-[3.2rem] text-center text-2xl md:text-3xl font-semibold bg-slate-900/90 border border-slate-700 rounded-lg px-2 py-1 shadow-sm">
                      {hasData ? timeParts.minutes : "--"}
                    </div>
                    <span className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                      Minutes
                    </span>
                  </div>

                  <div className="text-xl md:text-2xl text-slate-500 pb-4">
                    :
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="min-w-[3.2rem] text-center text-2xl md:text-3xl font-semibold bg-slate-900/90 border border-slate-700 rounded-lg px-2 py-1 shadow-sm">
                      {hasData ? timeParts.seconds : "--"}
                    </div>
                    <span className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">
                      Secondes
                    </span>
                  </div>
                </div>

                {/* statut */}
                <p className="text-[11px] text-slate-500 text-center">
                  {hasData
                    ? "À l’expiration, l’accès sera coupé automatiquement."
                    : "Calcul du temps restant à partir de votre lien…"}
                </p>
              </div>

              {/* barre de progression */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Progression du temps</span>
                  <span>
                    {hasData
                      ? `${timeParts.hours}h${timeParts.minutes} restantes`
                      : "Synchronisation…"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-transform duration-500 origin-left"
                    style={{ transform: `scaleX(${progress})` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Besoin d'aide */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Besoin d’aide ?
            </h2>
            <p className="text-sm text-slate-400">
              Si le chat ne s’affiche pas ou si votre lien a expiré, retournez
              sur{" "}
              <span className="text-slate-100">mycaradvisor.ch</span> pour générer
              un nouvel accès.
            </p>
            <a
              href="https://mycaradvisor.ch"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-400 text-slate-950 text-sm font-medium px-4 py-2 hover:bg-emerald-300 transition"
            >
              Retourner sur le site
            </a>
          </div>

          {/* Basic activé */}
          <div className="bg-gradient-to-r from-emerald-500/15 to-slate-900/0 border border-emerald-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-200 mb-1">
              Basic activé
            </p>
            <p className="text-sm text-slate-100">
              Accès aux fonctionnalités essentielles de l’agent.
            </p>
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
            <h2 className="text-sm font-semibold text-slate-100">
              Infos d’accès
            </h2>
            <p className="text-sm text-slate-400">
              Lien temporaire — demandez un nouveau lien si besoin.
            </p>

            <div className="bg-slate-950/40 border border-slate-800 rounded-lg p-3 space-y-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Temps restant
              </p>

              {/* TIMER MOBILE */}
              <div className="flex items-center gap-2 font-mono text-lg font-semibold">
                <span>{hasData ? timeParts.hours : "--"}</span>:
                <span>{hasData ? timeParts.minutes : "--"}</span>:
                <span>{hasData ? timeParts.seconds : "--"}</span>
              </div>

              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-transform duration-500 origin-left"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
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

/**
 * Wrapper Suspense pour Next.js
 * (useSearchParams doit être sous une boundary)
 */
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 text-sm">
          Initialisation de la session sécurisée…
        </div>
      }
    >
      <HomeInner />
    </Suspense>
  );
}
