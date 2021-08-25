import User from './User';
import Project from './Project';
import ProjectPermission from './ProjectPermission';
import UserPermission from './UserProjectPermission';
import setDatabase from '../tests/fixtures/setDatabase';

let project1: Project, user1: User, projectPermission1: ProjectPermission;

beforeEach(async () => {
  const { projects, users, projectPermissions } = await setDatabase();
  project1 = projects.project1;
  user1 = users.user1;
  projectPermission1 = projectPermissions.projectPermission1;
});

test('Should assign a permission for a user', async () => {
  await UserPermission.create({
    projectId: project1.id,
    userId: user1.id,
    permissionId: projectPermission1.id,
  });

  const newPermission = await UserPermission.findOne({
    where: {
      projectId: project1.id,
      userId: user1.id,
      permissionId: projectPermission1.id,
    },
    include: [
      {
        association: UserPermission.associations.Project,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        association: UserPermission.associations.User,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        association: UserPermission.associations.ProjectPermission,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!newPermission) throw new Error('No register for userPermission');

  expect(project1.get()).toMatchObject(newPermission.Project.get());
  expect(user1.get()).toMatchObject(newPermission.User.get());
  expect(projectPermission1.get()).toMatchObject(
    newPermission.ProjectPermission.get()
  );
});

test('Should remove a permission of a user', async () => {
  const user = await User.scope('withProjects').findByPk(1);

  if (!user?.Projects || !user?.Projects[0].ProjectPermissions)
    throw new Error('No register for permission');

  const permissionId = user.Projects[0].ProjectPermissions[0].id;

  UserPermission.destroy({
    where: {
      userId: user.id,
      projectId: user.Projects[0].id,
      permissionId: permissionId,
    },
  });

  const newUser = await User.scope('withProjects').findByPk(1);

  if (!newUser?.Projects || !newUser?.Projects[0].ProjectPermissions)
    throw new Error('No register for permission');

  const permissionNotFound = newUser.Projects[0].ProjectPermissions.find(
    ({ id }) => id === permissionId
  );

  expect(permissionNotFound).toBeUndefined();
});
