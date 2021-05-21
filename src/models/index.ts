import Company from './Company';
import User from './User';
import Permission from './Permissions';
import Project from './Project';
import UserPermission from './UserPermission';

Company.associate({ User, Project });
User.associate({ Company, Permission, Project });
Permission.associate({ User, Project });
Project.associate({ User, Permission, Company });
UserPermission.associate({ Project, User, Permission });

export { Company, User, Permission, Project, UserPermission };
