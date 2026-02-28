const logger = require('../../utils/logger');
const aiService = require('../../services/ai');
const { saveMessage, getRecentHistory } = require('../../database/sqlite');

module.exports = (bot) => {
    bot.on('text', async (ctx) => {
        try {
            const userMessage = ctx.message.text;
            const userId = ctx.from.id;

            logger.info({ userId, message: userMessage }, 'Mensaje recibido, enviando a IA...');

            // Evitar que Telegram lance timeout si la IA tarda: Mostrar 'escribiendo...'
            await ctx.sendChatAction('typing');

            // 1. Guardar mensaje del usuario
            await saveMessage(userId, 'user', userMessage);

            // 2. Obtener historial reciente
            const history = await getRecentHistory(userId, 5); // Últimos 5 mensajes

            // 3. Llamar a la IA (OpenRouter) pasando el historial
            const aiResponse = await aiService.generateResponse(userMessage, history);

            // 4. Guardar respuesta de la IA
            await saveMessage(userId, 'assistant', aiResponse);

            // 5. Enviar la respuesta de vuelta al usuario en Telegram
            await ctx.reply(aiResponse);

            logger.info({ userId }, 'Respuesta de IA enviada con éxito');
        } catch (error) {
            logger.error({ err: error }, 'Error procesando mensaje de texto');
            await ctx.reply('Ups, tuve un problema procesando tu mensaje.');
        }
    });
};
