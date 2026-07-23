/**
 * Limpia un RUT ingresado por el usuario, eliminando puntos y asegurando el formato XXXXXXXX-X.
 * Si el usuario ingresó puntos, se eliminan. Si no ingresó guion pero la longitud es correcta, lo infiere.
 */
export function cleanRut(rut: string): string {
  // Eliminar puntos y espacios
  let cleaned = rut.replace(/[\.\s]/g, '').toUpperCase();
  
  // Si no tiene guion pero tiene al menos 2 caracteres, insertar guion antes del último caracter
  if (!cleaned.includes('-') && cleaned.length >= 2) {
    cleaned = cleaned.slice(0, -1) + '-' + cleaned.slice(-1);
  }

  return cleaned;
}

/**
 * Valida si un string parece un RUT (formato básico).
 * No calcula el dígito verificador, solo valida el formato XXXXXXXX-X.
 */
export function isRutFormat(str: string): boolean {
  const cleaned = cleanRut(str);
  return /^[0-9]+-[0-9K]$/.test(cleaned);
}
