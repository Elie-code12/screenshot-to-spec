export type ReplyKind = "greeting" | "foro" | "archivo" | "thanks";

export type BotReply = {
  kind: ReplyKind;
  title: string;
  steps: string[];
  video?: string;
};

/** Placeholder link the teacher asked for; swap for the real video URL when it exists. */
export const VIDEO_URL = "https://www.video";

const FORO_TITLE = "Para configurar un foro en Tu Aula Virtual, sigue estos pasos:";
const ARCHIVO_TITLE = "Para subir un archivo a Tu Aula Virtual (Moodle 3.9), sigue estos 6 pasos:";

const FORO_STEPS = [
  "Ingresa a tu curso, haz clic en el ícono de engranaje (arriba a la derecha) y selecciona “Activar edición”.",
  "Ubica la semana o tema donde deseas el espacio y haz clic en “+ Añadir una actividad o recurso”.",
  "En la ventana emergente, selecciona la opción “Foro”.",
  "En la sección “General”, asigna un Nombre del foro (obligatorio) y redacta la consigna o instrucciones claras en el cuadro de Descripción.",
  "Despliega la opción “Tipo de foro” y elige el adecuado (por ejemplo, Debate sencillo o Foro para uso general) según tu objetivo pedagógico.",
  "Desplázate hasta el final de la página y haz clic en Guardar cambios y regresar al curso.",
];

const ARCHIVO_STEPS = [
  "Ingresa a tu curso, haz clic en el ícono de engranaje y selecciona Activar edición.",
  "Ubica la sección correspondiente y haz clic en “+ Añadir una actividad o recurso”.",
  "En el selector de recursos, baja hasta encontrar y seleccionar “Archivo”.",
  "Escribe el Nombre del recurso (este será el enlace en el que harán clic los estudiantes).",
  "En el apartado “Seleccionar archivos”, arrastra tu documento (PDF, Word, etc.) hacia la caja con la flecha azul, o usa el ícono de “Agregar” para buscarlo en tu computador.",
  "Haz clic en el botón Guardar cambios y regresar al curso ubicado en la parte inferior.",
];

/** lowercase, drop accents and punctuation, collapse spaces */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const GREETINGS = ["hola", "holi", "holaa", "buenos dias", "buenas tardes", "buenas noches", "saludos", "que tal", "hey"];
const THANKS = ["gracias", "muchas gracias", "mil gracias", "te lo agradezco", "muchisimas gracias"];

function hasWord(text: string, words: string[]): boolean {
  return words.some((w) => new RegExp(`(^|\\s)${w.replace(/\s+/g, "\\s+")}($|\\s)`).test(text));
}

/**
 * Topic wins over manners: "hola, quiero subir un archivo" gets the file steps,
 * not the greeting.
 */
export function getBotReply(raw: string): BotReply | null {
  const text = normalize(raw);
  if (!text) return null;

  if (/\bforo\b/.test(text) || /\bforos\b/.test(text)) {
    return { kind: "foro", title: FORO_TITLE, steps: FORO_STEPS, video: VIDEO_URL };
  }
  if (/\barchivos?\b/.test(text)) {
    return { kind: "archivo", title: ARCHIVO_TITLE, steps: ARCHIVO_STEPS, video: VIDEO_URL };
  }
  if (hasWord(text, GREETINGS)) {
    return {
      kind: "greeting",
      title: "Hola, el día de hoy te puedo ayudar en “configurar un foro” o “subir un archivo”.",
      steps: [],
    };
  }
  if (hasWord(text, THANKS)) {
    return { kind: "thanks", title: "Fue un gusto ayudarte, ¡hasta pronto!", steps: [] };
  }
  return null;
}
