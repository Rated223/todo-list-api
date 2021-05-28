import User, { UserCreationAttributes, UserRoles } from './User';
import Project from './Project';
import Permission from './Permission';
import setDatabase from '../tests/fixtures/setDatabase';
import faker from 'faker';

let project1: Project, permission1: Permission;

beforeEach(async () => {
  const { projects, permissions } = await setDatabase();
  project1 = projects.project1;
  permission1 = permissions.permission1;
});

test('Should create 2 new users of each role', async () => {
  const newUser1Data: UserCreationAttributes = {
    companyId: project1.id,
    role: 'ADMIN' as UserRoles,
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const newUser2Data: UserCreationAttributes = {
    companyId: project1.id,
    role: 'NORMAL' as UserRoles,
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  await User.bulkCreate([newUser1Data, newUser2Data]);

  const users = await User.findAll();

  expect(users.length).toBe(4);

  const newUser2 = users.pop();
  const newUser1 = users.pop();

  const { password: user1Password, ...user1DataToCheck } = newUser1Data;
  const { password: user2Password, ...user2DataToCheck } = newUser2Data;

  expect(newUser1).toMatchObject(user1DataToCheck);
  expect(await newUser1?.validPassword(user1Password)).toBe(true);

  expect(newUser2).toMatchObject(user2DataToCheck);
  expect(await newUser2?.validPassword(user2Password)).toBe(true);
});

test('Should create a user with permissions', async () => {
  const newUserData: UserCreationAttributes = {
    companyId: project1.id,
    role: 'NORMAL' as UserRoles,
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  const { id: newUserId } = await User.create(
    {
      ...newUserData,
      permissions: [
        {
          projectId: project1.id,
          permissionId: permission1.id,
        },
      ],
    },
    {
      include: [User.associations.UserPermissions],
    }
  );

  const newUser = await User.findByPk(newUserId, {
    include: [
      {
        association: User.associations.Projects,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      {
        association: User.associations.Permissions,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!newUser || !newUser.Projects || !newUser.Permissions)
    throw new Error('No register for user');

  const associateProject = newUser.Projects.pop();
  const associatePermission = newUser.Permissions.pop();

  if (!associateProject) throw new Error('No project associate.');
  if (!associatePermission) throw new Error('No permission associate.');

  expect(project1.id).toBe(associateProject.id);
  expect(project1.companyId).toBe(associateProject.companyId);
  expect(project1.name).toBe(associateProject.name);
  expect(project1.description).toBe(associateProject.description);

  expect(permission1.id).toBe(associatePermission.id);
  expect(permission1.description).toBe(associatePermission.description);
});

test('Should update a user', async () => {
  const user = await User.findOne();
  if (!user) throw new Error('No register for user');
  const originalData = user.get();

  await User.update(
    { firstName: faker.name.findName(), lastName: faker.name.lastName() },
    { where: { id: user.id } }
  );

  const updatedUser = await User.findByPk(user.id);
  if (!updatedUser) throw new Error('No register for user');

  expect(originalData.firstName).not.toBe(updatedUser.firstName);
  expect(originalData.lastName).not.toBe(updatedUser.lastName);
  expect(originalData.companyId).toBe(updatedUser.companyId);
  expect(originalData.role).toBe(updatedUser.role);
  expect(originalData.username).toBe(updatedUser.username);
  expect(originalData.email).toBe(updatedUser.email);
});

test('Should delete a user', async () => {
  const user = await User.findOne();
  if (!user) throw new Error('No register for user');

  await User.destroy({ where: { id: user.id } });

  const userNotFound = await User.findByPk(user.id);
  expect(userNotFound).toBeNull();
});
