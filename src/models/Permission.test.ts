import Permission, { PermissionCreationAttributes } from './Permission';
import setDatabase from '../tests/fixtures/setDatabase';
import faker from 'faker';

beforeEach(async () => {
  await setDatabase();
});

test('Should create 2 new permissions', async () => {
  const newPermission1Data: PermissionCreationAttributes = {
    description: faker.lorem.sentence(),
  };
  const newPermission2Data: PermissionCreationAttributes = {
    description: faker.lorem.sentence(),
  };

  await Permission.bulkCreate([newPermission1Data, newPermission2Data]);

  const permissions = await Permission.findAll();

  const newPermission2 = permissions.pop();
  const newPermission1 = permissions.pop();

  expect(newPermission1).toMatchObject(newPermission1Data);
  expect(newPermission2).toMatchObject(newPermission2Data);
});

test('Should update a new permission', async () => {
  const permission = await Permission.findOne();
  if (!permission) throw new Error('No register for permission');
  const originalData = permission.get();

  await Permission.update(
    { description: faker.lorem.sentence() },
    { where: { id: permission.id } }
  );

  const updatedPermission = await Permission.findByPk(permission.id);
  if (!updatedPermission) throw new Error('No register for permission');

  expect(originalData.description).not.toBe(updatedPermission.description);
});

test('Should delete a new permission', async () => {
  const permission = await Permission.findOne();
  if (!permission) throw new Error('No register for permission');

  await Permission.destroy({ where: { id: permission.id } });

  const permisisonNotfound = await Permission.findByPk(permission.id);
  expect(permisisonNotfound).toBeNull();
});
