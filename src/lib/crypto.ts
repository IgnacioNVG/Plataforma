import crypto from 'crypto';

// En producción esto debe venir de process.env.SECRET_KEY
// Para desarrollo usamos un string fijo.
const SECRET_KEY = process.env.SECRET_KEY || 'super_secret_pms_key_2026_xYz';

/**
 * Genera un hash determinista (HMAC-SHA256) para buscar datos privados
 * sin exponerlos en la base de datos (Ej: RUTs).
 * Al ser determinista, permite hacer queries `WHERE rut_hash = ?`.
 */
export function hashBlindIndex(text: string): string {
  // Estandarizar entrada: minúsculas, sin espacios
  const normalized = text.trim().toLowerCase();
  return crypto.createHmac('sha256', SECRET_KEY).update(normalized).digest('hex');
}
