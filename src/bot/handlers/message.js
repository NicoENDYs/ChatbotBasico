const logger = require('../../utils/logger');
// const aiService = require('../../services/ai'); // Lo usaremos después

module.exports = (bot) => {
    bot.on('text', async (ctx) => {
        try {
            const userMessage = ctx.message.text;
            const userId = ctx.from.id;

            logger.info({ userId, message: userMessage }, 'Mensaje de texto recibido');

            // Por ahora solo haremos un eco del mensaje para probar
            await ctx.reply(`Recibí tu mensaje: "${userMessage}"`);

            // TODO: Integrar aquí la llamada al servicio de IA (DeepSeek/OpenRouter)
        } catch (error) {
            logger.error({ err: error }, 'Error procesando mensaje de texto');
            await ctx.reply('Ups, tuve un problema procesando tu mensaje.');
        }
    });
};
