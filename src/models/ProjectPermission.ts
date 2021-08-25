import {
  Model,
  ModelStatic,
  DataTypes,
  Optional,
  BelongsToMany,
  HasMany,
} from 'sequelize';
import sequelize from '../database/connection';
import Project from './Project';
import User from './User';
import UserProjectPermission from './UserProjectPermission';

interface ProjectPermissionAttributes {
  id: number;
  description: string;
}

export interface ProjectPermissionCreationAttributes
  extends Optional<ProjectPermissionAttributes, 'id'> {}

interface ProjectPermissionAssociateModels {
  User: ModelStatic<User>;
  Project: ModelStatic<Project>;
  UserProjectPermission: ModelStatic<UserProjectPermission>;
}

class ProjectPermission
  extends Model<
    ProjectPermissionAttributes,
    ProjectPermissionCreationAttributes
  >
  implements ProjectPermissionAttributes {
  public id!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Users?: User[];
  public readonly Projects?: Project[];
  public static associations: {
    Users: BelongsToMany;
    Projects: BelongsToMany;
    UserPermissions: HasMany;
  };

  public static associate(models: ProjectPermissionAssociateModels): void {
    this.associations.Users = ProjectPermission.belongsToMany(models.User, {
      through: { model: UserProjectPermission, unique: false },
      foreignKey: 'permissionId',
      otherKey: 'userId',
    });
    this.associations.Projects = ProjectPermission.belongsToMany(
      models.Project,
      {
        through: { model: UserProjectPermission, unique: false },
        foreignKey: 'permissionId',
        otherKey: 'projectId',
      }
    );
    this.associations.UserPermissions = ProjectPermission.hasMany(
      models.UserProjectPermission,
      {
        sourceKey: 'id',
        foreignKey: 'permissionId',
      }
    );
  }
}

ProjectPermission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: 'project_permissions',
    sequelize,
  }
);

export default ProjectPermission;
