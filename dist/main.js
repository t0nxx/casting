"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
const path = require("path");
const socketio = require("socket.io");
const expsession = require('cookie-session');
const cookieParser = require("cookie-parser");
const index_1 = require("./routes/index");
const app = express();
const server = app.listen(process.env.PORT, () => 'running on port 3000');
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
typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
    app.use(bodyParser.json());
    app.use(cors());
    app.use(fileupload());
    app.use(express.static(path.join(__dirname, '..', 'dist-front', 'castingsecret')));
    app.use(index_1.default);
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist-front', 'castingsecret', 'index.html'));
    });
})).catch(error => console.log(error));
//# sourceMappingURL=main.js.map