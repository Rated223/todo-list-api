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
import UserPermission from './UserPermission';

interface PermissionAttributes {
  id: number;
  description: string;
}

export interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, 'id'> {}

interface PermissionAssociateModels {
  User: ModelStatic<User>;
  Project: ModelStatic<Project>;
  UserPermission: ModelStatic<UserPermission>;
}

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes {
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

  public static associate(models: PermissionAssociateModels): void {
    this.associations.Users = Permission.belongsToMany(models.User, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'permissionId',
      otherKey: 'userId',
    });
    this.associations.Projects = Permission.belongsToMany(models.Project, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'permissionId',
      otherKey: 'projectId',
    });
    this.associations.UserPermissions = Permission.hasMany(
      models.UserPermission,
      {
        sourceKey: 'id',
        foreignKey: 'permissionId',
      }
    );
  }
}

Permission.init(
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
    tableName: 'permissions',
    sequelize,
  }
);

export default Permission;
