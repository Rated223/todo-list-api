import express from 'express';
import { authRouter } from './routers';
import sequelize from './database/connection';

sequelize
  .authenticate()
  .catch((err) => console.error('Unable to connect to the database:', err));

const app = express();

app.use(express.json());

app.use(authRouter);

export default app;
