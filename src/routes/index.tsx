import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, GraduationCap, Mail, MessageCircle, AlertCircle } from "lucide-react";

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
  | { id: number; role: "bot"; title: string; steps: string[] }
  | { id: number; role: "fallback" };

const RESPONSES: Record<string, { title: string; steps: string[] }> = {
  "configurar foro": {
    title: "Para configurar un foro en Tu Aula Virtual (Moodle 3.9), sigue estos 3 pasos:",
    steps: [
      "Haz clic en el ícono de engranaje (arriba a la derecha) y selecciona 'Activar edición'.",
      "Ubica la semana o tema deseado, haz clic en 'Añadir una actividad o recurso' y selecciona 'Foro'.",
      "Asigna un Nombre, redacta las instrucciones en la Descripción, elige el Tipo de foro y presiona 'Guardar cambios y regresar al curso'.",
    ],
  },
  "subir archivo": {
    title: "Para subir un archivo a Tu Aula Virtual (Moodle 3.9), sigue estos 3 pasos:",
    steps: [
      "Haz clic en el ícono de engranaje y selecciona 'Activar edición'.",
      "En la sección correspondiente, haz clic en 'Añadir una actividad o recurso' y elige 'Archivo'.",
      "Escribe el Nombre del recurso, arrastra tu documento (PDF, Word, etc.) a la caja de subida y presiona 'Guardar cambios y regresar al curso'.",
    ],
  },
};

const glass = "bg-white/60 backdrop-blur-md border border-white/50 shadow-lg shadow-gray-200/50";

function Index() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      role: "bot",
      title: "¡Hola! Soy tu asistente virtual. Prueba escribiendo \"configurar foro\" o \"subir archivo\".",
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
    const key = text.toLowerCase();
    const r = RESPONSES[key];
    const now = Date.now();
    setMsgs((m) => [
      ...m,
      { id: now, role: "user", text },
      r ? { id: now + 1, role: "bot", ...r } : { id: now + 1, role: "fallback" },
    ]);
    setInput("");
  };

  return (
    <div className="mesh-bg flex h-screen flex-col gap-4 p-4 text-gray-800 sm:p-6">
      <header className={`${glass} mx-auto flex w-full max-w-4xl items-center gap-4 rounded-3xl px-6 py-4`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/70" aria-label="Logo de la universidad">
          <GraduationCap className="h-6 w-6 text-teal-800" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Soporte Virtual IDEAD</h1>
          <p className="text-sm text-gray-500">Asistencia para docentes · Tu Aula Virtual</p>
        </div>
      </header>

      <main className={`${glass} mx-auto w-full max-w-4xl flex-1 overflow-y-auto rounded-3xl p-4 sm:p-6`}>
        <div className="flex flex-col gap-4">
          {msgs.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-teal-800 px-4 py-3 text-white shadow-md">
                  {m.text}
                </div>
              </div>
            ) : m.role === "bot" ? (
              <div key={m.id} className="flex justify-start">
                <div className={`${glass} max-w-[80%] rounded-2xl rounded-bl-md px-4 py-3`}>
                  <p>{m.title}</p>
                  {m.steps.length > 0 && (
                    <ol className="mt-2 list-decimal space-y-1 pl-5">
                      {m.steps.map((s) => <li key={s}>{s}</li>)}
                    </ol>
                  )}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex justify-start">
                <div className={`${glass} w-full max-w-sm rounded-3xl p-5`}>
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-5 w-5 text-teal-800" />
                    No puedo clasificar tu consulta
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Comunícate con el equipo de la UPMT:</p>
                  <div className="mt-3 space-y-2">
                    <a href="mailto:upmt@ut.edu.co" className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-3 py-2 hover:bg-white/80">
                      <Mail className="h-4 w-4 text-teal-800" /> upmt@ut.edu.co
                    </a>
                    <a href="https://wa.me/573216574352" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-3 py-2 hover:bg-white/80">
                      <MessageCircle className="h-4 w-4 text-teal-800" /> WhatsApp: 321 657 4352
                    </a>
                  </div>
                </div>
              </div>
            ),
          )}
          <div ref={endRef} />
        </div>
      </main>

      <form onSubmit={send} className={`${glass} mx-auto flex w-full max-w-4xl items-center gap-3 rounded-3xl p-3`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta…"
          className="flex-1 rounded-2xl bg-white/40 px-4 py-3 text-gray-800 placeholder:text-gray-500 outline-none focus:bg-white/70"
        />
        <button type="submit" className="flex items-center gap-2 rounded-2xl bg-teal-800 px-5 py-3 font-medium text-white shadow-md transition hover:bg-teal-900">
          <Send className="h-4 w-4" /> Enviar
        </button>
      </form>
    </div>
  );
}
