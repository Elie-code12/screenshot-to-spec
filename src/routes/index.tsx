import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Mail, MessageCircle, AlertCircle, Play } from "lucide-react";

import logoAsset from "@/assets/idead-logo.png.asset.json";
import { getBotReply } from "@/lib/chat-rules";
import { Button } from "@/components/ui/button";

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

const glass = "rounded-2xl border border-chat-user/50 bg-chat-background/40 shadow-xl backdrop-blur-md";
const botBubble =
  "bg-gradient-to-r from-chat-celadon/80 to-chat-light/80 text-chat-background shadow-md backdrop-blur-sm";

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
    <div className="relative isolate flex h-screen flex-col overflow-hidden bg-chat-background text-chat-light">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-chat-user opacity-40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[34rem] w-[34rem] rounded-full bg-chat-celadon opacity-40 blur-3xl"
      />

      <div className="mx-auto w-full max-w-4xl shrink-0 px-4 pt-4 sm:px-6">
        <header className={`${glass} flex items-center gap-4 px-4 py-4`}>
          <div className="shrink-0 rounded-xl bg-chat-logo p-2" aria-label="Logo IDEAD en los territorios">
            <img src={logoAsset.url} alt="IDEAD — En los territorios" className="h-9 w-auto max-w-[35vw] object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Soporte Virtual IDEAD</h1>
            <p className="text-sm text-chat-light">Asistencia para docentes · Tu Aula Virtual</p>
          </div>
        </header>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-4">
        <main className={`${glass} min-h-0 flex-1 overflow-y-auto p-4`}>
          <div className="flex flex-col gap-4">
            {msgs.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[80%] break-words rounded-2xl bg-chat-user px-4 py-3 text-chat-light shadow-md">
                    {m.text}
                  </div>
                </div>
              ) : m.role === "bot" ? (
                <div key={m.id} className="flex justify-start">
                  <div className={`${botBubble} max-w-[90%] break-words rounded-2xl rounded-bl-md px-4 py-3 sm:max-w-[80%]`}>
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
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-chat-light/60 px-3 py-2 text-sm font-medium text-chat-background transition hover:bg-chat-light"
                      >
                        <Play className="h-4 w-4" /> Ver el corto video explicativo
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className={`${botBubble} w-full max-w-sm rounded-2xl p-5`}>
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="h-5 w-5 shrink-0 text-chat-background" />
                      No puedo clasificar tu consulta
                    </div>
                    <p className="mt-1 text-sm text-chat-background">Comunícate con el equipo de la UPMT:</p>
                    <div className="mt-3 space-y-2">
                      <a href="mailto:upmt@ut.edu.co" className="flex items-center gap-3 rounded-xl bg-chat-light/60 px-3 py-2 hover:bg-chat-light">
                        <Mail className="h-4 w-4 shrink-0 text-chat-background" /> upmt@ut.edu.co
                      </a>
                      <a
                        href="https://wa.me/573216574352"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl bg-chat-light/60 px-3 py-2 hover:bg-chat-light"
                      >
                        <MessageCircle className="h-4 w-4 shrink-0 text-chat-background" /> WhatsApp: 321 657 4352
                      </a>
                    </div>
                  </div>
                </div>
              ),
            )}
            <div ref={endRef} />
          </div>
        </main>
      </div>

      <div className="mx-auto w-full max-w-4xl shrink-0 px-4 pb-4 sm:px-6">
        <form onSubmit={send} className={`${glass} flex items-center gap-3 p-3`}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta…"
            className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-chat-light placeholder:text-chat-celadon/70 outline-none focus:ring-0"
          />
          <Button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-chat-celadon px-5 py-3 font-medium text-chat-background shadow-md hover:bg-chat-celadon/90"
          >
            <Send className="h-4 w-4" /> Enviar
          </Button>
        </form>
      </div>
    </div>
  );
}
