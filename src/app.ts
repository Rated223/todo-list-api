import express from 'express';
import { authRouter } from './routers';
import sequelize from './database/connection';

sequelize
  .authenticate()
  .then(() => console.log('Db connection has been established.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

const app = express();

app.use(express.json());

app.use(authRouter);

export default app;
