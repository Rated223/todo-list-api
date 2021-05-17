import { Company, User } from '../../models';
import sequelize from '../../database/connection';

const setDatabase = async (): Promise<void> => {
  try {
    await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0;', { raw: true });
    await sequelize.truncate();

    const { id: Company1Id } = await Company.create({
      name: 'Test Company 1',
      email: 'testCompany1@email.com',
      phone: '8114526386',
      web: 'testCompany1.com',
    });

    await User.bulkCreate([
      {
        companyId: Company1Id,
        role: 'ADMIN',
        firstName: 'Test 1',
        lastName: 'User 1',
        username: 'testUser1',
        email: 'testUser1@email.com',
        password: 'test',
      },
      {
        companyId: Company1Id,
        role: 'NORMAL',
        firstName: 'Test 2',
        lastName: 'User 2',
        username: 'testUser2',
        email: 'testUser2@email.com',
        password: 'test',
      },
    ]);

    // await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 1;', { raw: true });
  } catch (error) {
    throw new Error(`Setting mock data error: ${error}`);
  }
};

export default setDatabase;
