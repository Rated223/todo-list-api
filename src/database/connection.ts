import { Sequelize } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const sequelize = new Sequelize(process.env.DB_URI!);

export default sequelize;
