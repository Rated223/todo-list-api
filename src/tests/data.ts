import { UserRoles } from '../models/User';

export const company1Data = {
  name: 'Test Company 1',
  email: 'testCompany1@email.com',
  phone: '8114526386',
  web: 'testCompany1.com',
};

export const user1Data = {
  role: 'ADMIN' as UserRoles,
  firstName: 'Test 1',
  lastName: 'User 1',
  username: 'testUser1',
  email: 'testUser1@email.com',
  password: 'test',
};

export const user2Data = {
  role: 'NORMAL' as UserRoles,
  firstName: 'Test 2',
  lastName: 'User 2',
  username: 'testUser2',
  email: 'testUser2@email.com',
  password: 'test',
};

export const project1Data = {
  description: 'description for project 1',
  name: 'Project 1',
};

export const project2Data = {
  description: 'description for project 2',
  name: 'Project 2',
};

export const projectPermission1Data = {
  description: 'description for project permission 1',
};

export const projectPermission2Data = {
  description: 'description for project permission 2',
};

export const projectPermission3Data = {
  description: 'description for project permission 3',
};
