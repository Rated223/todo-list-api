import app from '../../app';
import { SingnupBody } from './signup';
import setDatabase from '../../tests/fixtures/setDatabase';
import faker from 'faker';
import request from 'supertest';

beforeEach(async () => {
  await setDatabase();
});

test('Should sign up a company', async () => {
  const body: SingnupBody = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    company: {
      name: faker.company.companyName(),
      email: faker.internet.password(),
      phone: faker.phone.phoneNumber(),
      web: faker.internet.url(),
    },
  };

  const response = await request(app).post('/signup').send(body).expect(200);
  expect(response.body.success).toBe(true);
});
