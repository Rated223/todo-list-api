import express from 'express';
import { authRouter } from './routers';
import './database/connection';

const app = express();

app.use(express.json());

app.use(authRouter);

export default app;
