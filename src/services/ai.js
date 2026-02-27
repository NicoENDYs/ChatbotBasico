/**
 * Servicio de integración con Inteligencia Artificial (OpenRouter / DeepSeek)
 */
const config = require('../config/env');
const logger = require('../utils/logger');

const generateResponse = async (prompt) => {
    if (!config.OPENROUTER_API_KEY) {
        logger.warn('Falta OPENROUTER_API_KEY. Retornando respuesta por defecto.');
        return "Lo siento, la inteligencia artificial no está configurada aún.";
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${config.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": config.AI_MODEL,
                "messages": [
                    { "role": "system", "content": "Eres un asistente básico y amigable en Telegram." },
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Error en OpenRouter: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Retornar solo el contenido del mensaje
        return data.choices && data.choices[0] && data.choices[0].message.content
            ? data.choices[0].message.content
            : "No pude generar una respuesta.";

    } catch (error) {
        logger.error({ err: error, prompt }, 'Error llamando a la IA');
        return "Hubo un problema de conexión con mi 'cerebro'. Por favor intenta más tarde.";
    }
};

module.exports = {
    generateResponse
};
