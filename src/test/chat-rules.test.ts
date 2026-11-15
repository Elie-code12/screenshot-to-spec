import { describe, expect, it } from "vitest";

import { getBotReply, getChatTurn } from "@/lib/chat-rules";

describe("Soporte Virtual IDEAD replies", () => {
  it("greets on Hola in any casing", () => {
    for (const input of ["Hola", "hola", "HOLA", "¡Hola!"]) {
      expect(getBotReply(input)?.kind).toBe("greeting");
    }
    expect(getBotReply("Hola")?.title).toContain("configurar un foro");
    expect(getBotReply("Hola")?.title).toContain("subir un archivo");
    expect(getBotReply("Hola")?.steps).toEqual([]);
  });

  it("gives the foro steps for every foro wording", () => {
    for (const input of ["foro", "Foro", "configurar foro ", "configurar un foro", "FORO"]) {
      const reply = getBotReply(input);
      expect(reply?.kind).toBe("foro");
      expect(reply?.title).toBe("Para configurar un foro en Tu Aula Virtual, sigue estos pasos:");
      expect(reply?.steps).toHaveLength(6);
      expect(reply?.steps[0]).toContain("Activar edición");
      expect(reply?.steps[5]).toContain("Guardar cambios y regresar al curso");
      expect(reply?.video).toBe("https://www.video");
    }
  });

  it("gives the archivo steps for every archivo wording", () => {
    for (const input of ["archivo", "Archivo", "configurar archivo", "subir un archivo", "ARCHIVO"]) {
      const reply = getBotReply(input);
      expect(reply?.kind).toBe("archivo");
      expect(reply?.title).toBe("Para subir un archivo a Tu Aula Virtual (Moodle 3.9), sigue estos 6 pasos:");
      expect(reply?.steps).toHaveLength(6);
      expect(reply?.steps[4]).toContain("flecha azul");
      expect(reply?.video).toBe("https://www.video");
    }
  });

  it("says goodbye on gracias", () => {
    for (const input of ["gracias", "Gracias", "muchas gracias"]) {
      expect(getBotReply(input)?.kind).toBe("thanks");
    }
    expect(getBotReply("gracias")?.title).toBe("Fue un gusto ayudarte, ¡hasta pronto!");
  });

  it("falls back when nothing matches", () => {
    expect(getBotReply("ayuda")).toBeNull();
    expect(getBotReply("   ")).toBeNull();
  });
});

describe("HU4 consecutive classification failures", () => {
  it("counts the first unknown query as one and returns a reply instead of support", () => {
    for (const input of ["error", "ayuda", "calificaciones"]) {
      const turn = getChatTurn(input, 0);
      expect(turn.failedAttempts).toBe(1);
      expect(turn.reply).not.toBeNull();
      expect(turn.reply?.steps).toEqual([]);
      expect(turn.reply?.video).toBeUndefined();
    }
  });

  it("returns support on the second consecutive unknown query", () => {
    const first = getChatTurn("error", 0);
    const second = getChatTurn("ayuda", first.failedAttempts);
    expect(second.failedAttempts).toBe(2);
    expect(second.reply).toBeNull();
  });

  it("resets to zero when hola, foro or archivo is recognized before support takes over", () => {
    for (const input of ["hola", "foro", "archivo"]) {
      const turn = getChatTurn(input, 1);
      expect(turn.failedAttempts).toBe(0);
      expect(turn.reply?.kind).toBe(getBotReply(input)?.kind);
      expect(getChatTurn("error", turn.failedAttempts).failedAttempts).toBe(1);
    }
  });

  it("keeps the existing thanks reply and interrupts the failure streak", () => {
    expect(getChatTurn("gracias", 1).failedAttempts).toBe(0);
    expect(getChatTurn("gracias", 1).reply?.kind).toBe("thanks");
  });

  it("stops automatic replies after two failures, even for recognized queries", () => {
    for (const input of ["foro", "archivo", "hola", "ayuda"]) {
      expect(getChatTurn(input, 2)).toEqual({ failedAttempts: 2, reply: null });
    }
  });
});
