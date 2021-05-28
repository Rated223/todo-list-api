import Company from './Company';
import User from './User';
import Permission from './Permission';
import Project from './Project';
import UserPermission from './UserPermission';

Company.associate({ User, Project });
User.associate({ Company, Permission, Project, UserPermission });
Permission.associate({ User, Project, UserPermission });
Project.associate({ User, Permission, Company, UserPermission });
UserPermission.associate({ Project, User, Permission });

User.addScopes();
Project.addScopes();

export { Company, User, Permission, Project, UserPermission };
