import { Company, User } from '../../models';
import { UserRoles } from '../../models/User';
import sequelize from '../../database/connection';

export const company1Data = {
  name: 'Test Company 1',
  email: 'testCompany1@email.com',
  phone: '8114526386',
  web: 'testCompany1.com',
};

export const user1Data = {
  role: 'ADMIN' as UserRoles,
  firstName: 'Test 1',
  lastName: 'User 1',
  username: 'testUser1',
  email: 'testUser1@email.com',
  password: 'test',
};

export const user2Data = {
  role: 'NORMAL' as UserRoles,
  firstName: 'Test 2',
  lastName: 'User 2',
  username: 'testUser2',
  email: 'testUser2@email.com',
  password: 'test',
};

const setDatabase = async (): Promise<Record<string, unknown>> => {
  try {
    await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0;', { raw: true });
    await sequelize.truncate();

    const company1 = await Company.create(company1Data);

    const [user1, user2] = await User.bulkCreate([
      { companyId: company1.id, ...user1Data },
      { companyId: company1.id, ...user2Data },
    ]);

    // await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 1;', { raw: true });

    return { company1, user1, user2 };
  } catch (error) {
    throw new Error(`Setting mock data error: ${error}`);
  }
};

export default setDatabase;
