import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Mail, MessageCircle, AlertCircle, Play } from "lucide-react";

import logoAsset from "@/assets/idead-logo.png.asset.json";
import { getBotReply } from "@/lib/chat-rules";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Soporte Virtual IDEAD — Asistente docente" },
      { name: "description", content: "Chat de asistencia para docentes universitarios en Tu Aula Virtual (Moodle 3.9)." },
      { property: "og:title", content: "Soporte Virtual IDEAD" },
      { property: "og:description", content: "Asistente virtual para docentes del IDEAD." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Msg =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "bot"; title: string; steps: string[]; video?: string | undefined }
  | { id: number; role: "fallback" };

const glass = "bg-white/70 backdrop-blur-md border border-white/60 shadow-lg";
const botBubble = "bg-white/90 backdrop-blur-md shadow-lg text-gray-800";

function Index() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      role: "bot",
      title: '¡Hola! Soy tu asistente virtual. Escribe "hola", "configurar un foro" o "subir un archivo".',
      steps: [],
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const r = getBotReply(text);
    const now = Date.now();
    setMsgs((m) => [
      ...m,
      { id: now, role: "user", text },
      r ? { id: now + 1, role: "bot", title: r.title, steps: r.steps, video: r.video } : { id: now + 1, role: "fallback" },
    ]);
    setInput("");
  };

  return (
    <div className="app-bg relative isolate flex h-screen flex-col gap-4 overflow-hidden p-4 text-gray-800 sm:p-6">
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-96 w-96 rounded-full bg-red-600/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-emerald-900/25 blur-3xl" />

      <header className={`${glass} mx-auto flex w-full max-w-4xl items-center gap-4 rounded-2xl px-6 py-4`}>
        <div className="flex h-14 shrink-0 items-center rounded-2xl border border-white/60 bg-white/70 px-3" aria-label="Logo IDEAD en los territorios">
          <img src={logoAsset.url} alt="IDEAD — En los territorios" className="h-9 w-auto" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Soporte Virtual IDEAD</h1>
          <p className="text-sm text-gray-400">Asistencia para docentes · Tu Aula Virtual</p>
        </div>
      </header>

      <main className={`${glass} mx-auto w-full max-w-4xl flex-1 overflow-y-auto rounded-2xl p-4 sm:p-6`}>
        <div className="flex flex-col gap-4">
          {msgs.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-full bg-red-600 px-5 py-3 text-white shadow-md">
                  {m.text}
                </div>
              </div>
            ) : m.role === "bot" ? (
              <div key={m.id} className="flex justify-start">
                <div className={`${botBubble} max-w-[80%] rounded-2xl rounded-bl-md px-4 py-3`}>
                  <p>{m.title}</p>
                  {m.steps.length > 0 && (
                    <ol className="mt-2 list-decimal space-y-1 pl-5">
                      {m.steps.map((s) => <li key={s}>{s}</li>)}
                    </ol>
                  )}
                  {m.video && (
                    <a
                      href={m.video}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-2 text-sm font-medium text-red-700 hover:bg-white/90"
                    >
                      <Play className="h-4 w-4" /> Ver el corto video explicativo
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-start">
                <div className={`${glass} w-full max-w-sm rounded-2xl p-5`}>
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    No puedo clasificar tu consulta
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Comunícate con el equipo de la UPMT:</p>
                  <div className="mt-3 space-y-2">
                    <a href="mailto:upmt@ut.edu.co" className="flex items-center gap-3 rounded-full border border-white/60 bg-white/60 px-3 py-2 hover:bg-white/90">
                      <Mail className="h-4 w-4 text-red-600" /> upmt@ut.edu.co
                    </a>
                    <a href="https://wa.me/573216574352" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-full border border-white/60 bg-white/60 px-3 py-2 hover:bg-white/90">
                      <MessageCircle className="h-4 w-4 text-red-600" /> WhatsApp: 321 657 4352
                    </a>
                  </div>
                </div>
              </div>
            ),
          )}
          <div ref={endRef} />
        </div>
      </main>

      <form onSubmit={send} className={`${glass} mx-auto flex w-full max-w-4xl items-center gap-3 rounded-2xl p-3`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta…"
          className="flex-1 bg-transparent px-4 py-3 text-gray-800 placeholder:text-gray-400 outline-none"
        />
        <button type="submit" className="flex items-center gap-2 rounded-full bg-emerald-800 px-5 py-3 font-medium text-white shadow-md transition hover:bg-emerald-900">
          <Send className="h-4 w-4" /> Enviar
        </button>
      </form>
    </div>
  );
}
