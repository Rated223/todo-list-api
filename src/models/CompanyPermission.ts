import {
  BelongsToMany,
  DataTypes,
  Model,
  ModelStatic,
  Optional,
} from 'sequelize';
import sequelize from '../database/connection';
import User from './User';

interface CompanyPermissionAttributes {
  id: number;
  description: string;
}

export interface CompanyPermissionCreationAttributes
  extends Optional<CompanyPermissionAttributes, 'id'> {}

interface CompanyPermissionAssociateModels {
  User: ModelStatic<User>;
}

class CompanyPermission
  extends Model<
    CompanyPermissionAttributes,
    CompanyPermissionCreationAttributes
  >
  implements CompanyPermissionAttributes {
  public id!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Users?: User[];
  public static associations: {
    Users: BelongsToMany;
  };

  public static associate(models: CompanyPermissionAssociateModels): void {
    this.associations.Users = CompanyPermission.belongsToMany(models.User, {
      through: 'user_company_permissions',
      foreignKey: 'permissionId',
      otherKey: 'userId',
    });
  }
}

CompanyPermission.init(
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
    tableName: 'company_permissions',
    sequelize,
  }
);

export default CompanyPermission;
