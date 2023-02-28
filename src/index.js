import express from "express";
var http = require('http');
import bodyParser from "body-parser";
import { v1routes } from '!/routes';
import createHttpError from "http-errors";
import { notFound } from "./middlewares/errorHandler";
import { responseHandler } from "./middlewares/responseHandler";
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import logger, { logStream } from "~/utils/logger";
import morgan from "morgan";
const session = require('express-session');
const path = require('path');

var restify = require('restify')
var xss = require('xss-clean')
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");

var dotenv = require('dotenv').config();
const app = express(),
    APP_PORT = process.env.APP_PORT,
    APP_HOST = process.env.APP_HOST;
app.set("port", APP_PORT);
app.set("host", APP_HOST);

app.use(fileUpload());

global.avatar_placeholder = process.env.AVATAR_PLACEHOLDER;
app.use( morgan( "tiny", { "stream": logStream } ) );

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

//parse application/json
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/* make sure this comes before any routes */
app.use(xss());

const sessionExpireTime = parseInt(process.env.SESSION_EXPIRE_TIME)
app.use(session({
    secret: 'abc',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Session expires after 24 hours of inactivity.
        expires: sessionExpireTime
    }
}))

// set the view engine to ejs
app.set('view engine', 'ejs');

// for multiple view
app.set('views', [path.join(__dirname, "views"), path.join(__dirname, "modules/v1/auth/views"), 
path.join(__dirname, "modules/v1/admin/views"), path.join(__dirname, "modules/v1/meta/views"),
path.join(__dirname, "modules/v1/user/views"), path.join(__dirname, "modules/v1/setting/views")]);

// set path for public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * router managment for v1
 */
app.use("/", v1routes);

/*set error middleware*/
app.use(notFound); //return default error message not found

app.listen(app.get("port"), () => {
    console.log(`Server listing at http://${app.get("host")}:${app.get("port")}`)
})

process.on( "uncaughtException", ( err ) => {
    logger.error( err.message );
} );

process.on( "unhandledRejection", ( reason ) => {
    logger.error( reason );
} );

export default app;