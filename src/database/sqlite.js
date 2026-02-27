const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../utils/logger');

// Definir la ruta del archivo de base de datos
const dbPath = path.resolve(__dirname, 'chatbot.db');

// Crear la conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        logger.error({ err }, 'Error al conectar con la base de datos SQLite');
    } else {
        logger.info('Conectado a la base de datos SQLite con éxito');
    }
});

/**
 * Inicializa las tablas necesarias en la base de datos
 */
const initDb = () => {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                telegram_id INTEGER UNIQUE NOT NULL,
                username TEXT,
                first_name TEXT,
                language_code TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            (err) => {
                if (err) {
                    logger.error({ err }, 'Error al crear la tabla users');
                } else {
                    logger.info('Tabla users verificada/creada');
                }
            }
        );

        // Agregar mas tablas segun se necesiten
    });
};

/**
 * Guarda o actualiza un usuario en la base de datos
 */
const upsertUser = (telegramId, username, firstName, languageCode) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO users (telegram_id, username, first_name, language_code) 
             VALUES (?, ?, ?, ?)
             ON CONFLICT(telegram_id) DO UPDATE SET 
             username=excluded.username, 
             first_name=excluded.first_name, 
             language_code=excluded.language_code`,
            [telegramId, username, firstName, languageCode],
            function (err) {
                if (err) {
                    logger.error({ err, telegramId }, 'Error al guardar usuario');
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
};

module.exports = {
    db,
    initDb,
    upsertUser,
};
