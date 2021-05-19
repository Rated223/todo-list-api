import app from '../../app';
import { LoginBody } from './login';
import setDatabase, { user1Data } from '../../tests/fixtures/setDatabase';
import faker from 'faker';
import request from 'supertest';

beforeEach(async () => {
  await setDatabase();
});

test('Should allow a user login', async () => {
  const body: LoginBody = {
    username: user1Data.username,
    password: user1Data.password,
  };

  const response = await request(app).post('/login').send(body).expect(200);
  expect(response.body.success).toBe(true);
});

test('Should response and error for an invalid user', async () => {
  const body: LoginBody = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };

  const response = await request(app).post('/login').send(body).expect(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('Invalid username or password.');
});

test('Should response an error for a bad password', async () => {
  const body: LoginBody = {
    username: user1Data.username,
    password: faker.internet.password(),
  };

  const response = await request(app).post('/login').send(body).expect(404);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('Invalid username or password.');
});
