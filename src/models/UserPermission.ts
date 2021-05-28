import { Model, ModelStatic, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../database/connection';
import Permission from './Permission';
import Project from './Project';
import User from './User';

export interface UserPermissionAttributes {
  projectId: number;
  userId: number;
  permissionId: number;
}

interface UserPermissionAssociateModels {
  Project: ModelStatic<Project>;
  User: ModelStatic<User>;
  Permission: ModelStatic<Permission>;
}

class UserPermission extends Model {
  public projectId!: number;
  public userId!: number;
  public permissionId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Project!: Project;
  public readonly User!: User;
  public readonly Permission!: Permission;
  public static associations: {
    Project: BelongsTo;
    User: BelongsTo;
    Permission: BelongsTo;
  };

  public static associate(models: UserPermissionAssociateModels): void {
    this.associations.Project = UserPermission.belongsTo(models.Project, {
      foreignKey: 'projectId',
      targetKey: 'id',
    });
    this.associations.User = UserPermission.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    this.associations.Permission = UserPermission.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      targetKey: 'id',
    });
  }
}

UserPermission.init(
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
    tableName: 'user_permissions',
    sequelize,
  }
);

export default UserPermission;
