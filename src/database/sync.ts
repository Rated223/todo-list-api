import sequelize from './connection';

if (process.env.NODE_ENV !== 'PROD') {
  sequelize
    .sync({ alter: true })
    .then(() => console.log('All models were synchronized.'))
    .then(() => sequelize.close())
    .catch((err) => console.error('Unable to connect to the database:', err));
}
