import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fileupload from 'express-fileupload';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as path from 'path';
import * as socketio from 'socket.io';
// import * as expsession from 'express-session';
const  expsession = require('cookie-session');
import * as cookieParser from 'cookie-parser';
import routes from './routes/index';
// tslint:disable-next-line: no-var-requires
// create express app
const app = express();
const server = app.listen(3000, () => 'running on port 3000');
const io = socketio(server);
app.set('io', io);
// get it from any place 
//  const ioS = request.app.get('io');

// i changed my mind :D , i'll store socket id in the session
const sessionMiddleware = expsession({
    secret: 'CastingSec',
    secure: false,
    expires: new Date(Date.now() + 3600000),
});

// run session middleware for regular http connections
app.use(sessionMiddleware);
app.use(cookieParser())


// run session middleware for socket.io connections
io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
});

createConnection().then(async connection => {

    app.use(bodyParser.json());
    app.use(cors({ credentials: true, origin: ['http://localhost:4200', 'http://localhost','http://localhost:3000','http://castingsecret.com:3000','http://www.castingsecret.com:3000','http://castingsecret.com'] }));
    //app.use(cors());
    app.use(fileupload());

    app.use(express.static(path.join(__dirname, '..', 'dist-front', 'castingsecret')));
    app.use(express.static(path.join(__dirname, '..', 'admin')));
    app.use(routes);

    io.on('connection', socket => {

        console.log(`socket.io connected: ${socket.id}`);

        // save socket.io socket in the session
        socket.request.session.socketio = socket.id;
        //socket.request.session.save();
        console.log('new socket session', socket.request.session);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    app.get('/dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist-front', 'castingsecret', 'index.html'));
    });

}).catch(error => console.log(error));
