import { Company, User, ProjectPermission, Project } from '../../models';
import sequelize from '../../database/connection';
import {
  company1Data,
  user1Data,
  user2Data,
  project1Data,
  project2Data,
  projectPermission1Data,
  projectPermission2Data,
  projectPermission3Data,
} from '../data';

interface setDatabaseResult {
  companies: Record<string, Company>;
  users: Record<string, User>;
  projects: Record<string, Project>;
  projectPermissions: Record<string, ProjectPermission>;
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
      projectPermission1,
      projectPermission2,
      projectPermission3,
    ] = await ProjectPermission.bulkCreate([
      projectPermission1Data,
      projectPermission2Data,
      projectPermission3Data,
    ]);

    const [user1, user2] = await User.bulkCreate(
      [
        {
          companyId: company1.id,
          ...user1Data,
          projectPermissions: [
            {
              projectId: project1.id,
              permissionId: projectPermission2.id,
            },
            {
              projectId: project2.id,
              permissionId: projectPermission3.id,
            },
          ],
        },
        {
          companyId: company1.id,
          ...user2Data,
          projectPermissions: [
            {
              projectId: project2.id,
              permissionId: projectPermission1.id,
            },
            {
              projectId: project2.id,
              permissionId: projectPermission3.id,
            },
          ],
        },
      ],
      {
        include: [User.associations.UserProjectPermissions],
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
      projectPermissions: {
        projectPermission1,
        projectPermission2,
        projectPermission3,
      },
    };
  } catch (error) {
    throw new Error(`Setting mock data error: ${error}`);
  }
};

export default setDatabase;
