# ChatbotBasico

## Intentar crear un chatbot basico para estos usos
1. chat
2. menus
3. memoria y configuracion (sqlite o similar)


## Stack Tecnologico
- javascript
- nodejs
- sqlite
- fastify
- logger


## Conexion con telegram Bot
- telegraf


# Iniciar proyecto

1. instalar dependencias
```bash
npm i
```
2.crear archivo .env
```bash
cp .env.example .env
```
3. configurar variables de entorno
```javascript
TELEGRAM_BOT_TOKEN=tu_token_de_telegram
OPENROUTER_API_KEY=tu_api_key_de_openrouter
```




## Calidad de Código (Linter & Formatter)

Para mantener el orden en el codigo y revisar posibles errores, se añadio ESLint y Prettier:

- Dar formato automático a carpeta `src/`:
  ```bash
  npm run format
  ```
- Revisar problemas y posibles errores:
  ```bash
  npm run lint
  ```
