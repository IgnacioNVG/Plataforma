export default {
  // Manejador que ejecuta Cloudflare cuando el Cron se dispara
  async scheduled(event, env, ctx) {
    console.log(`Cron disparado a las: ${new Date(event.scheduledTime).toISOString()}`);

    try {
      // Endpoint principal de la plataforma
      // Cambiar esto a la URL de producción cuando esté lista (ej. https://tu-dominio.com/api/cron/inactividad)
      const API_URL = "https://fast-filament.navasgranizo-ignacio.workers.dev/api/cron/inactividad";
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.CRON_SECRET}`
        }
      });

      if (!response.ok) {
        console.error(`Error al llamar al API: Status ${response.status}`);
        const text = await response.text();
        console.error("Respuesta:", text);
      } else {
        const data = await response.json();
        console.log("Notificaciones procesadas exitosamente:", data);
      }
    } catch (err) {
      console.error("Excepción durante la ejecución del cron:", err);
    }
  }
};
