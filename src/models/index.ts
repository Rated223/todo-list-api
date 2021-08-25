import Company from './Company';
import User from './User';
import ProjectPermission from './ProjectPermission';
import Project from './Project';
import UserProjectPermission from './UserProjectPermission';

Company.associate({ User, Project });
User.associate({ Company, ProjectPermission, Project, UserProjectPermission });
ProjectPermission.associate({ User, Project, UserProjectPermission });
Project.associate({ User, ProjectPermission, Company, UserProjectPermission });
UserProjectPermission.associate({ Project, User, ProjectPermission });

User.addScopes();
Project.addScopes();

export { Company, User, ProjectPermission, Project, UserProjectPermission };
