import { Model, ModelStatic, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../database/connection';
import ProjectPermission from './ProjectPermission';
import Project from './Project';
import User from './User';

export interface UserProjectPermissionAttributes {
  projectId: number;
  userId: number;
  permissionId: number;
}

interface UserProjectPermissionAssociateModels {
  Project: ModelStatic<Project>;
  User: ModelStatic<User>;
  ProjectPermission: ModelStatic<ProjectPermission>;
}

class UserProjectPermission extends Model {
  public projectId!: number;
  public userId!: number;
  public permissionId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Project!: Project;
  public readonly User!: User;
  public readonly ProjectPermission!: ProjectPermission;
  public static associations: {
    Project: BelongsTo;
    User: BelongsTo;
    ProjectPermission: BelongsTo;
  };

  public static associate(models: UserProjectPermissionAssociateModels): void {
    this.associations.Project = UserProjectPermission.belongsTo(
      models.Project,
      {
        foreignKey: 'projectId',
        targetKey: 'id',
      }
    );
    this.associations.User = UserProjectPermission.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    this.associations.ProjectPermission = UserProjectPermission.belongsTo(
      models.ProjectPermission,
      {
        foreignKey: 'permissionId',
        targetKey: 'id',
      }
    );
  }
}

UserProjectPermission.init(
  {
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    tableName: 'user_project_permissions',
    sequelize,
  }
);

export default UserProjectPermission;
