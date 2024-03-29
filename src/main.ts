import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fileupload from 'express-fileupload';
import * as cors from 'cors';
import * as  Queue from 'bull';
import * as socketio from 'socket.io';
import * as cookieParser from 'cookie-parser';
import routes from './routes/index';
import { JoinChatRooms } from './middlewares/JoinChatRooms';
import * as Sentry from '@sentry/node';

// packages has no ts definition
const expsession = require('cookie-session');
const { setQueues, UI } = require('bull-board');

/**
 * Queue services
 * i put them here to run directly with the main process
 */

import SendNotifiationJob from './jobs/SendNotification';
import SendEmailsJob from './jobs/SendEmails';
import { ChaneUsersOnlineSatusJob } from './jobs/cron/OnlineStatusJob';
import { dbDailyBackup } from './jobs/cron/dbBackup';

// create queues in redis
export const notificationQueue = new Queue('notiQueue', { redis: { host: '127.0.0.1', port: 6379 } });
export const autoReplyMessageQueue = new Queue('autoReplyMsg', { redis: { host: '127.0.0.1', port: 6379 } });
export const sendEmailsQueue = new Queue('emailsQueue', { redis: { host: '127.0.0.1', port: 6379 } });

// create express app
const app = express();
const server = app.listen(3000, () => 'running on port 3000');
const io = socketio(server);
app.set('io', io);

/**
 * Here i'm storing the socket id for each user in the session
 */
const sessionMiddleware = expsession({
    secret: 'CastingSec',
    secure: false,
    expires: new Date(Date.now() + 3600000),
});

// initailze sentry for error reporting
Sentry.init({
    dsn: 'https://4d868ea97fce4925b37c80b4b6a9d46f@o412866.ingest.sentry.io/5294024',
    attachStacktrace: true,
});
app.use(Sentry.Handlers.requestHandler());


// run session middleware for regular http connections
app.use(sessionMiddleware);
app.use(cookieParser());

// run session middleware for socket.io connections
io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
});

createConnection().then(async connection => {
    // await connection.runMigrations();

    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(cors({
        credentials: true, origin: [
            'http://localhost:4200', 'http://localhost', 'http://localhost:3000',
            'http://localhost:5001',
            'http://castingsecret.com:3000', 'http://www.castingsecret.com:3000',
            'http://castingsecret.com', 'http://www.castingsecret.com',
            'https://castingsecret.com', 'https://www.castingsecret.com',
            'http://casting-admin.s3-website.eu-central-1.amazonaws.com',
            'https://casting-admin-panel.s3.eu-central-1.amazonaws.com',
            'http://casting-admin-panel.s3.eu-central-1.amazonaws.com',
            'http://casting-admin-panel.s3-website.eu-central-1.amazonaws.com',
            'http://3.125.225.214', 'http://3.125.225.214:3000',
            'https://admin.castingsecret.com', 'https://d32dm90ra3bag1.cloudfront.net',
            'https://castingsecret.com/', 'https://www.castingsecret.com/',
        ],
    }));
    app.use(fileupload({
        limits: { fileSize: 100 * 1024 * 1024 },
    }));

    // join chat rooms middleware
    // note order matter
    app.use(JoinChatRooms);

    app.use(routes);
    app.use('/queue', UI);

    // socket io initialize handler
    io.on('connection', socket => {

        // console.log(`socket.io connected: ${socket.id}`);

        // save socket.io socket in the session
        socket.request.session.socketio = socket.id;
        socket.on('disconnect', () => {
            // console.log('user disconnected');
        });
    });


    app.get('*', (req, res) => {
        return res.status(404).send({ error: 'Not Found' });
    });

    // sentry error sender
    app.use(Sentry.Handlers.errorHandler());


    // excute each queue / cron job worker
    ChaneUsersOnlineSatusJob();
    dbDailyBackup();
    setQueues([
        notificationQueue,
        sendEmailsQueue,
    ]);

    notificationQueue.process(SendNotifiationJob);
    sendEmailsQueue.process(SendEmailsJob);

    notificationQueue.on('failed', job => {
        console.log('****************** job fail ******** for job ' + job);
    });
    sendEmailsQueue.on('failed', job => {
        console.log('****************** job fail ******** for job ' + job);
    })


}).catch(error => {
    console.log(error);
    Sentry.captureException(error);
});
