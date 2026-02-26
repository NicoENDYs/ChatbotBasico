require('dotenv').config();

const {
    TELEGRAM_BOT_TOKEN,
    OPENROUTER_API_KEY,
    PORT,
    LOG_LEVEL,
} = process.env;

// Validar variables de token y key
if (!TELEGRAM_BOT_TOKEN) {
    console.error('CRITICAL: TELEGRAM_BOT_TOKEN no está definido en el archivo .env');
    process.exit(1);
}

if (!OPENROUTER_API_KEY) {
    console.warn('WARNING: OPENROUTER_API_KEY no está definido. La integración con IA fallará.');
}

module.exports = {
    TELEGRAM_BOT_TOKEN,
    OPENROUTER_API_KEY,
    PORT: PORT || 3000,
    LOG_LEVEL: LOG_LEVEL || 'info',
};
