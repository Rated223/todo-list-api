import { Sequelize, Options as SequelizeOptions } from 'sequelize';

const sequelize = (): Sequelize => {
  try {
    if (!process.env.DB_URI) throw new Error();

    const options: SequelizeOptions =
      process.env.ENV === 'test' ? { logging: false } : {};

    return new Sequelize(process.env.DB_URI, options);
  } catch (error) {
    throw new Error('Invalid database URI');
  }
};

export default sequelize();
