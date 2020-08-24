import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../database/connection';
import { Company } from './index';

enum UserRoles {
  ADMIN = 'ADMIN',
  NORMAL = 'NORMAL',
}

interface UserAttributes {
  id: number;
  companyId: number;
  role: UserRoles;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public companyId!: number;
  public role!: UserRoles.NORMAL;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public readonly password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM({
        values: Object.values(UserRoles),
      }),
      allowNull: false,
      defaultValue: UserRoles.NORMAL,
    },
    firstName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
  }
);

User.belongsTo(Company, { foreignKey: 'companyId' });

export default User;
