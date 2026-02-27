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

        // Tabla para el historial de mensajes
        db.run(
            `CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                telegram_id INTEGER NOT NULL,
                role TEXT NOT NULL, -- 'user' o 'assistant'
                content TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(telegram_id) REFERENCES users(telegram_id)
            )`,
            (err) => {
                if (err) {
                    logger.error({ err }, 'Error al crear la tabla messages');
                } else {
                    logger.info('Tabla messages verificada/creada');
                }
            }
        );
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

/**
 * Guarda un mensaje en el historial
 */
const saveMessage = (telegramId, role, content) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO messages (telegram_id, role, content) VALUES (?, ?, ?)`,
            [telegramId, role, content],
            function (err) {
                if (err) {
                    logger.error({ err, telegramId }, 'Error al guardar mensaje en el historial');
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            }
        );
    });
};

/**
 * Obtiene el historial reciente de un usuario
 * @param {number} telegramId - El ID del usuario
 * @param {number} limit - Cantidad de mensajes a recuperar (por defecto 10 para no exceder tokens)
 */
const getRecentHistory = (telegramId, limit = 10) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT role, content FROM messages WHERE telegram_id = ? ORDER BY id DESC LIMIT ?`,
            [telegramId, limit],
            (err, rows) => {
                if (err) {
                    logger.error({ err, telegramId }, 'Error al obtener historial de mensajes');
                    reject(err);
                } else {
                    // Los obtenemos DESC para obtener los últimos, pero los necesitamos en orden cronológico (ASC) para la IA
                    resolve(rows.reverse());
                }
            }
        );
    });
};

module.exports = {
    db,
    initDb,
    upsertUser,
    saveMessage,
    getRecentHistory,
};
