import { Company, User, Permission, Project } from '../../models';
import sequelize from '../../database/connection';
import {
  company1Data,
  user1Data,
  user2Data,
  project1Data,
  project2Data,
  permission1Data,
  permission2Data,
  permission3Data,
} from '../data';

interface setDatabaseResult {
  companies: Record<string, Company>;
  users: Record<string, User>;
  projects: Record<string, Project>;
  permissions: Record<string, Permission>;
}

const setDatabase = async (): Promise<setDatabaseResult> => {
  try {
    await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 0;', { raw: true });
    await sequelize.truncate();

    const company1 = await Company.create(company1Data);

    const [project1, project2] = await Project.bulkCreate([
      { companyId: company1.id, ...project1Data },
      { companyId: company1.id, ...project2Data },
    ]);

    const [
      permission1,
      permission2,
      permission3,
    ] = await Permission.bulkCreate([
      permission1Data,
      permission2Data,
      permission3Data,
    ]);

    const [user1, user2] = await User.bulkCreate(
      [
        {
          companyId: company1.id,
          ...user1Data,
          permissions: [
            {
              projectId: project1.id,
              permissionId: permission2.id,
            },
            {
              projectId: project2.id,
              permissionId: permission3.id,
            },
          ],
        },
        {
          companyId: company1.id,
          ...user2Data,
          permissions: [
            {
              projectId: project2.id,
              permissionId: permission1.id,
            },
            {
              projectId: project2.id,
              permissionId: permission3.id,
            },
          ],
        },
      ],
      {
        include: [User.associations.UserPermissions],
      }
    );

    // await sequelize.query('SET GLOBAL FOREIGN_KEY_CHECKS = 1;', { raw: true });

    return {
      companies: {
        company1,
      },
      users: {
        user1,
        user2,
      },
      projects: {
        project1,
        project2,
      },
      permissions: {
        permission1,
        permission2,
        permission3,
      },
    };
  } catch (error) {
    throw new Error(`Setting mock data error: ${error}`);
  }
};

export default setDatabase;
