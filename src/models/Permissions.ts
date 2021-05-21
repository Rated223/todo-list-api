import {
  Model,
  ModelStatic,
  DataTypes,
  Optional,
  BelongsToMany,
} from 'sequelize';
import sequelize from '../database/connection';
import UserPermission from './UserPermission';

interface PermissionAttributes {
  id: number;
  description: string;
}

export interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, 'id'> {}

interface PermissionAssociateModels {
  User: ModelStatic<Model>;
  Project: ModelStatic<Model>;
}

class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes {
  public id!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static Users: BelongsToMany;
  static Projects: BelongsToMany;

  public static associate(models: PermissionAssociateModels): void {
    this.Users = Permission.belongsToMany(models.User, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'userId',
    });
    this.Projects = Permission.belongsToMany(models.Project, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'projectId',
    });
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
