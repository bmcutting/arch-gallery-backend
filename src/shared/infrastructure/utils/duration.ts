const SECONDS_BY_UNIT: Record<string, number> = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
};

/** Convierte `30d`, `12h`, `15m` o `45s` a segundos. */
export function durationToSeconds(duration: string): number {
  const unit = duration.trim().slice(-1);
  const value = Number(duration.trim().slice(0, -1));
  const secondsPerUnit = SECONDS_BY_UNIT[unit];

  // Lanza en vez de caer a un defecto: lo llama `EnvService`, así que un valor
  // mal escrito rompe el arranque y no la caducidad de los tokens.
  if (!secondsPerUnit || !Number.isInteger(value) || value <= 0) {
    throw new Error(
      `Duración inválida: "${duration}". Se espera un entero positivo seguido de s, m, h o d.`,
    );
  }

  return value * secondsPerUnit;
}
