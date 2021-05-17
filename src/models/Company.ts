import { Model, ModelStatic, DataTypes, Optional, HasMany } from 'sequelize';
import sequelize from '../database/connection';

interface CompanyAttributes {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  web: string | null;
  users?: Record<string, unknown>[] | null;
}

export interface CompanyCreationAttributes
  extends Optional<CompanyAttributes, 'id'> {}

interface CompanyAssociateModels {
  User: ModelStatic<Model>;
}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone!: string | null;
  public web!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static Users: HasMany;

  public static associate(models: CompanyAssociateModels): void {
    this.Users = Company.hasMany(models.User, {
      sourceKey: 'id',
      foreignKey: 'companyId',
      as: 'users',
    });
  }
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    web: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  },
  {
    tableName: 'companies',
    sequelize,
  }
);

export default Company;
