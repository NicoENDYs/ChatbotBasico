# Estructura pensada para el proyecto
ChatbotBasico/
├── src/
│   ├── index.js        ← entrada principal (bot + servidor)
│   ├── bot/
│   │   ├── commands/   ← /start, /help, etc.
│   │   └── handlers/   ← lógica de mensajes
│   └── services/
│       └── ai.js       ← integración OpenRouter/deepseek
├── .env
└── package.json

# Stack Tecnologico
- javascript
- nodejs
- sqlite
- telegraf
- fastify
- logger

# Instrucciones
- Crear un chatbot basico para estos usos
1. chat
2. menus
3. memoria y configuracion (sqlite o similar)
- Conexion con telegram Bot
- usar las siguientes herramientas
- javascript
- nodejs
- sqlite
- telegraf
- fastify
- logger