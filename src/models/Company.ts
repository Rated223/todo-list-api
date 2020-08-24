import {
  Model,
  DataTypes,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import sequelize from '../database/connection';
import { User } from './index';

interface CompanyAttributes {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  web: string | null;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes {
  id!: number;
  name!: string;
  email!: string;
  phone!: string | null;
  web!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUsers!: HasManyGetAssociationsMixin<User>;
  public addUser!: HasManyAddAssociationMixin<User, number>;
  public hasUser!: HasManyHasAssociationMixin<User, number>;
  public countUsers!: HasManyCountAssociationsMixin;
  public createUser!: HasManyCreateAssociationMixin<User>;
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

Company.hasMany(User, { foreignKey: 'companyId' });

export default Company;
