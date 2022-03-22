/* eslint-disable eol-last */
/* eslint-disable indent */
import env from './env';

module.exports = {
    production: {
        // url: process.env.PRO_URL,
        dialect: 'mysql',
        host: env.DB_HOST,
        database: env.DB_NAME,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true
            }
        }
    },
    development: {
        // url: process.env.DATABASE_URL_DEV || process.env.LOCAL_URL,
        dialect: 'mysql',
        host: env.DB_HOST,
        database: env.DB_NAME,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true
            }
        }
    },

    test: {
        url: env.DATABASE_URL_TEST || env.LOCAL_URL,
        dialect: 'mysql',
    },
};
