import { Model, ModelStatic, DataTypes, BelongsTo } from 'sequelize';
import sequelize from '../database/connection';

export interface UserPermissionAttributes {
  projectId: number;
  userId: number;
  permissionId: number;
}

interface UserPermissionAssociateModels {
  Project: ModelStatic<Model>;
  User: ModelStatic<Model>;
  Permission: ModelStatic<Model>;
}

class UserPermission extends Model {
  public projectId!: number;
  public userId!: number;
  public permissionId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static Projects: BelongsTo;
  static Users: BelongsTo;
  static Permissions: BelongsTo;

  public static associate(models: UserPermissionAssociateModels): void {
    this.Projects = UserPermission.belongsTo(models.Project, {
      foreignKey: 'projectId',
      targetKey: 'id',
    });
    this.Users = UserPermission.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    this.Permissions = UserPermission.belongsTo(models.Permission, {
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
