import Company, { CompanyCreationAttributes } from './Company';
import setDatabase from '../tests/fixtures/setDatabase';
import faker from 'faker';

beforeEach(async () => {
  await setDatabase();
});

test('Should create 2 new companies', async () => {
  const newCompany1Data: CompanyCreationAttributes = {
    name: faker.company.companyName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    web: faker.internet.url(),
  };
  const newCompany2Data: CompanyCreationAttributes = {
    name: faker.company.companyName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    web: faker.internet.url(),
  };

  await Company.bulkCreate([newCompany1Data, newCompany2Data]);

  const companies = await Company.findAll();

  expect(companies.length).toBe(3);

  const newCompany2 = companies.pop();
  const newCompany1 = companies.pop();

  expect(newCompany1).toMatchObject(newCompany1Data);
  expect(newCompany2).toMatchObject(newCompany2Data);
});

test('Should update a company', async () => {
  const company = await Company.findOne();
  if (!company) throw new Error('No register for company');
  const originalData = company.get();

  await Company.update(
    { name: faker.company.companyName() },
    { where: { id: company.id } }
  );

  const updatedCompany = await Company.findByPk(company.id);
  if (!updatedCompany) throw new Error('No register for company');

  expect(originalData.name).not.toBe(updatedCompany.name);
  expect(originalData.email).toBe(updatedCompany.email);
  expect(originalData.phone).toBe(updatedCompany.phone);
  expect(originalData.web).toBe(updatedCompany.web);
});

test('Should delete a company', async () => {
  const company = await Company.findOne();
  if (!company) throw new Error('No register for company');

  await Company.destroy({ where: { id: company.id } });

  const companyNotFound = await Company.findByPk(company.id);
  expect(companyNotFound).toBeNull();
});
