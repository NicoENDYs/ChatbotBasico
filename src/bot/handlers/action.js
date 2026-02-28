const logger = require('../../utils/logger');
// Necesitaremos la base de datos si queremos implementar "Borrar Memoria"
const { db } = require('../../database/sqlite');

module.exports = (bot) => {
    // Escuchar todas las acciones de los botones (callback_query)
    bot.on('callback_query', async (ctx) => {
        try {
            const userId = ctx.from.id;
            // El 'data' es lo que definimos en el botón (ej. 'action_help')
            const action = ctx.callbackQuery.data;

            logger.info({ userId, action }, 'Usuario interactuó con el menú');

            // Responder a la acción (quitando el estado de "cargando" del botón en Telegram)
            await ctx.answerCbQuery();

            // Manejar cada acción específica
            switch (action) {
                case 'action_help':
                    await ctx.reply(
                        'ℹ️ *Ayuda del Bot*\n\n' +
                            '- Escríbeme cualquier cosa para chatear con la Inteligencia Artificial.\n' +
                            '- Usa `/start` para reiniciar nuestra charla.\n' +
                            '- Usa `/menu` para ver estas opciones de nuevo.',
                        { parse_mode: 'Markdown' }
                    );
                    break;

                case 'action_clear_memory':
                    // Eliminar historial del usuario en la base de datos
                    db.run('DELETE FROM messages WHERE telegram_id = ?', [userId], async (err) => {
                        if (err) {
                            logger.error({ err, userId }, 'Error borrando memoria');
                            await ctx.reply('❌ No pude borrar tu memoria. Intenta luego.');
                        } else {
                            await ctx.reply(
                                '🧠 ¡Zas! He olvidado nuestras conversaciones recientes.'
                            );
                        }
                    });
                    break;

                case 'action_settings':
                    await ctx.reply(
                        '⚙️ Las configuraciones estarán disponibles en una versión futura.'
                    );
                    break;

                default:
                    await ctx.reply('⚠️ Acción no reconocida.');
            }
        } catch (error) {
            logger.error({ err: error }, 'Error procesando acción del menú');
        }
    });
};
