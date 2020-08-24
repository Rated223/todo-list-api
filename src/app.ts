import express from 'express';
import bodyParser from 'body-parser';
import { authRouter } from './routers';
import './database/connection';

const app = express();

app.use(bodyParser.json());

app.use(authRouter);

export default app;
