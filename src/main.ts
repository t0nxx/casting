import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fileupload from 'express-fileupload';
import { Request, Response } from 'express';
import * as cors from 'cors';
import * as path from 'path';
import routes from './routes/index';

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use(fileupload());
    app.use(express.static(path.join(__dirname, '..', 'dist-front', 'castingsecret')));
    app.use(routes);
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist-front', 'castingsecret', 'index.html'));

    });
    app.listen(3000);
    console.log('Express server has started on port 3000. Open http://localhost:3000/ to see results');

}).catch(error => console.log(error));
