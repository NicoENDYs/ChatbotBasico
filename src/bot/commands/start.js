const logger = require('../../utils/logger');
const { upsertUser } = require('../../database/sqlite');

module.exports = (bot) => {
    bot.start(async (ctx) => {
        try {
            const user = ctx.from;

            // Guardar usuario en la base de datos
            await upsertUser(
                user.id,
                user.username || null,
                user.first_name || null,
                user.language_code || null
            );

            logger.info({ userId: user.id }, 'Nuevo usuario inició el bot');

            // Mensaje de bienvenida
            await ctx.reply(
                `¡Hola, ${user.first_name || 'amigo'}! 👋\n\n` +
                    `Soy tu bot básico. Estoy aquí para ayudarte.\n` +
                    `Envíame cualquier mensaje y te responderé.`
            );
        } catch (error) {
            logger.error({ err: error }, 'Error en el comando /start');
            await ctx.reply('Ocurrió un error al iniciar. Por favor, intenta de nuevo más tarde.');
        }
    });
};
