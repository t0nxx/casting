import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import * as cors from 'cors';
import routes from './routes/index';

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use(routes);
    app.get('/', (req, res) => {
        res.send('hhhhh');
    });
    app.listen(3000);
    console.log('Express server has started on port 3000. Open http://localhost:3000/ to see results');

}).catch(error => console.log(error));
