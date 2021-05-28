import Project, { ProjectCreationAttributes } from './Project';
import Company from './Company';
import setDatabase from '../tests/fixtures/setDatabase';
import faker from 'faker';

let company1: Company;

beforeEach(async () => {
  const { companies } = await setDatabase();
  company1 = companies.company1;
});

test('Should create 2 new projects', async () => {
  const newProject1Data: ProjectCreationAttributes = {
    companyId: company1.id,
    description: faker.lorem.sentence(),
    name: faker.name.title(),
  };
  const newProject2Data: ProjectCreationAttributes = {
    companyId: company1.id,
    description: null,
    name: faker.name.title(),
  };

  await Project.bulkCreate([newProject1Data, newProject2Data]);

  const projects = await Project.findAll();

  const newProject2 = projects.pop();
  const newProject1 = projects.pop();

  expect(newProject1).toMatchObject(newProject1Data);
  expect(newProject2).toMatchObject(newProject2Data);
});

test('Should update a project', async () => {
  const project = await Project.findOne();
  if (!project) throw new Error('No register for project');
  const originalData = project.get();

  await Project.update(
    { description: faker.lorem.sentence() },
    { where: { id: project.id } }
  );

  const updatedProject = await Project.findByPk(project.id);
  if (!updatedProject) throw new Error('No register for project');

  expect(originalData.description).not.toBe(updatedProject.description);
  expect(originalData.name).toBe(updatedProject.name);
});

test('Should delete a project', async () => {
  const project = await Project.findOne();
  if (!project) throw new Error('No register for project');

  await Project.destroy({ where: { id: project.id } });

  const projectNotFound = await Project.findByPk(project.id);
  expect(projectNotFound).toBeNull();
});
