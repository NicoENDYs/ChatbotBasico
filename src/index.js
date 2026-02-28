const fastify = require('fastify')({ logger: true });
const { Telegraf } = require('telegraf');
const config = require('./config/env');
const logger = require('./utils/logger');
const { initDb } = require('./database/sqlite');

// Configuración de base de datos
initDb();

// Configuración del bot
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

// Configuración de comandos y manejadores
const setupStartCommand = require('./bot/commands/start');
const setupMenuCommand = require('./bot/commands/menu');
const setupMessageHandlers = require('./bot/handlers/message');
const setupActionHandlers = require('./bot/handlers/action');

setupStartCommand(bot);
setupMenuCommand(bot);
setupMessageHandlers(bot);
setupActionHandlers(bot);

// Iniciar servidor web y bot
const start = async () => {
    try {
        // Fastify puede servir para webhooks o health checks
        fastify.get('/', async (request, reply) => {
            return { status: 'Bot is running', model: config.AI_MODEL };
        });

        await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
        logger.info(`Servidor escuchando en http://localhost:${config.PORT}`);

        // Iniciar el bot en modo polling
        bot.launch();
        logger.info('Bot de Telegram iniciado');
    } catch (err) {
        logger.error({ err }, 'Error iniciando la aplicación');
        process.exit(1);
    }
};

start();
