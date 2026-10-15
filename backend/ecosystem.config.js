// ecosystem.config.js
/**
 * Configuración de despliegue para PM2
 * 
 * 1. Define 'clinica-backend' como proceso gestionado por PM2 ejecutando el código compilado (dist/main.js).
 * 2. Define la variable de entorno TZ ('America/Argentina/Buenos_Aires') para forzar a Node.js a operar globalmente bajo la zona horaria de Argentina (UTC-3). Esto garantiza que las validaciones y los registros de turnos/reservas médicos en PostgreSQL mantengan la concordancia horaria sin importar la zona horaria por defecto del servidor.
 */

module.exports = {
  apps: [
    {
      name: 'clinica-backend',
      script: 'dist/main.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        TZ: 'America/Argentina/Buenos_Aires',
      },
    },
  ],
};