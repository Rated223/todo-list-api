import User, { UserCreationAttributes } from './User';
import setDatabase from '../tests/fixtures/setDatabase';
import faker from 'faker';

beforeEach(async () => {
  await setDatabase();
});

test('Should create 2 new users of each role', async () => {
  const newUser1Data: UserCreationAttributes = {
    companyId: 1,
    role: 'ADMIN',
    firstName: faker.name.findName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
  const newUser2Data: UserCreationAttributes = {
    companyId: 1,
    role: 'NORMAL',
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
