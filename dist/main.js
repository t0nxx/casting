"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");
const Queue = require("bull");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
const index_1 = require("./routes/index");
const JoinChatRooms_1 = require("./middlewares/JoinChatRooms");
const expsession = require('cookie-session');
const { setQueues, UI } = require('bull-board');
const SendNotification_1 = require("./jobs/SendNotification");
const SendEmails_1 = require("./jobs/SendEmails");
const OnlineStatusJob_1 = require("./jobs/cron/OnlineStatusJob");
const dbBackup_1 = require("./jobs/cron/dbBackup");
exports.notificationQueue = new Queue('notiQueue', { redis: { host: '127.0.0.1', port: 6379 } });
exports.autoReplyMessageQueue = new Queue('autoReplyMsg', { redis: { host: '127.0.0.1', port: 6379 } });
exports.sendEmailsQueue = new Queue('emailsQueue', { redis: { host: '127.0.0.1', port: 6379 } });
const app = express();
const server = app.listen(3000, () => 'running on port 3000');
const io = socketio(server);
app.set('io', io);
const sessionMiddleware = expsession({
    secret: 'CastingSec',
    secure: false,
    expires: new Date(Date.now() + 3600000),
});
app.use(sessionMiddleware);
app.use(cookieParser());
io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
});
typeorm_1.createConnection().then((connection) => __awaiter(void 0, void 0, void 0, function* () {
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
    app.use(JoinChatRooms_1.JoinChatRooms);
    app.use(index_1.default);
    app.use('/queue', UI);
    io.on('connection', socket => {
        console.log(`socket.io connected: ${socket.id}`);
        socket.request.session.socketio = socket.id;
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
    app.get('*', (req, res) => {
        res.status(404).send({ error: 'Not Found' });
    });
    OnlineStatusJob_1.ChaneUsersOnlineSatusJob();
    dbBackup_1.dbDailyBackup();
    setQueues([
        exports.notificationQueue,
        exports.sendEmailsQueue,
    ]);
    exports.notificationQueue.process(SendNotification_1.default);
    exports.sendEmailsQueue.process(SendEmails_1.default);
    exports.notificationQueue.on('failed', job => {
        console.log('****************** job fail ******** for job ' + job);
    });
    exports.sendEmailsQueue.on('failed', job => {
        console.log('****************** job fail ******** for job ' + job);
    });
})).catch(error => console.log(error));
//# sourceMappingURL=main.js.map