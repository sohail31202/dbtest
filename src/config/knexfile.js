/**
 * .env file use for the variable setting
 */
require('dotenv').config()

let environment = process.env.NODE_ENV
let connection = ''
    /**
     * checking the environment for the server for database connection
     */

if (process.env.NODE_ENV == 'production') {
    connection = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: process.env.DB_CHARSET,
        timezone: process.env.DB_TIMEZONE
    }

} else if (process.env.NODE_ENV == 'staging') {
    connection = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: process.env.DB_CHARSET,
        timezone: process.env.DB_TIMEZONE
    }
} else if (process.env.NODE_ENV == 'development') {
    connection = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: process.env.DB_CHARSET,
        timezone: process.env.DB_TIMEZONE
    }
} else {
    console.log(`No database env`)
}

module.exports = {
    connection,
    "client": process.env.DB_CLIENT
};