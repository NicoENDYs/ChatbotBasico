const logger = require('../../utils/logger');
const aiService = require('../../services/ai');

module.exports = (bot) => {
    bot.on('text', async (ctx) => {
        try {
            const userMessage = ctx.message.text;
            const userId = ctx.from.id;

            logger.info({ userId, message: userMessage }, 'Mensaje recibido, enviando a IA...');

            // Evitar que Telegram lance timeout si la IA tarda: Mostrar 'escribiendo...'
            await ctx.sendChatAction('typing');

            // Llamar a la IA (OpenRouter)
            const aiResponse = await aiService.generateResponse(userMessage);

            // Enviar la respuesta de vuelta al usuario en Telegram
            await ctx.reply(aiResponse);

            logger.info({ userId }, 'Respuesta de IA enviada con éxito');

        } catch (error) {
            logger.error({ err: error }, 'Error procesando mensaje de texto');
            await ctx.reply('Ups, tuve un problema procesando tu mensaje.');
        }
    });
};
