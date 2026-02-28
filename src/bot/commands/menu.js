const { Markup } = require('telegraf');
const logger = require('../../utils/logger');

module.exports = (bot) => {
    bot.command('menu', async (ctx) => {
        try {
            const userId = ctx.from.id;
            logger.info({ userId }, 'Usuario solicitó el menú interactivo');

            // Crear un teclado en línea (botones debajos del mensaje)
            const menuKeyboard = Markup.inlineKeyboard([
                // Fila 1
                [
                    Markup.button.callback('❓ Ayuda', 'action_help'),
                    Markup.button.callback('🧠 Borrar Memoria', 'action_clear_memory'),
                ],
                // Fila 2
                [Markup.button.callback('⚙️ Configuración (Pronto)', 'action_settings')],
            ]);

            // Enviar el mensaje con el teclado adjunto
            await ctx.reply(
                '🤖 *Menú Principal*\n\n¿En qué te puedo ayudar hoy? Selecciona una opción:',
                {
                    parse_mode: 'Markdown',
                    ...menuKeyboard,
                }
            );
        } catch (error) {
            logger.error({ err: error }, 'Error en el comando /menu');
            await ctx.reply('Error al cargar el menú. Intenta de nuevo.');
        }
    });
};
