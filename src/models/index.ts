import Company from './Company';
import CompanyPermission from './CompanyPermission';
import Project from './Project';
import ProjectPermission from './ProjectPermission';
import User from './User';
import UserProjectPermission from './UserProjectPermission';

Company.associate({ User, Project });
CompanyPermission.associate({ User });
ProjectPermission.associate({ User, Project, UserProjectPermission });
User.associate({
  Company,
  CompanyPermission,
  Project,
  ProjectPermission,
  UserProjectPermission,
});
Project.associate({ User, ProjectPermission, Company, UserProjectPermission });
UserProjectPermission.associate({ Project, User, ProjectPermission });

Project.addScopes();
User.addScopes();

export {
  Company,
  CompanyPermission,
  Project,
  ProjectPermission,
  User,
  UserProjectPermission,
};
