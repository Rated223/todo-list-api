import { Model, ModelStatic, DataTypes, Optional, HasMany } from 'sequelize';
import sequelize from '../database/connection';
import Project from './Project';
import User, { UserCreationAttributes } from './User';

interface CompanyAttributes {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  web: string | null;
}

export interface CompanyCreationAttributes
  extends Optional<CompanyAttributes, 'id'> {
  users?: Omit<UserCreationAttributes, 'companyId'>[] | null;
}

interface CompanyAssociateModels {
  User: ModelStatic<User>;
  Project: ModelStatic<Project>;
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

  public readonly Users?: User[];
  public readonly Projects?: Project[];
  public static associations: {
    Users: HasMany;
    Projects: HasMany;
  };

  public static associate(models: CompanyAssociateModels): void {
    this.associations.Users = Company.hasMany(models.User, {
      sourceKey: 'id',
      foreignKey: 'companyId',
      as: 'users',
    });
    this.associations.Projects = Company.hasMany(models.Project, {
      sourceKey: 'id',
      foreignKey: 'companyId',
      as: 'projects',
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    web: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: 'companies',
    sequelize,
  }
);

export default Company;
