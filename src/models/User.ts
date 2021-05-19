import bcrypt from 'bcrypt';
import { Model, ModelStatic, DataTypes, Optional, BelongsTo } from 'sequelize';
import sequelize from '../database/connection';

export type UserRoles = 'ADMIN' | 'NORMAL';

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

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

interface UserAssociateModels {
  Company: ModelStatic<Model>;
}

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public companyId!: number;
  public role!: UserRoles;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public readonly password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static Company: BelongsTo;

  public static associate(models: UserAssociateModels): void {
    this.Company = User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      targetKey: 'id',
    });
  }

  public async validPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
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
        values: ['ADMIN', 'NORMAL'],
      }),
      allowNull: false,
      defaultValue: 'NORMAL',
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
      set(pass: string) {
        this.setDataValue('password', bcrypt.hashSync(pass, 8));
      },
    },
  },
  {
    tableName: 'users',
    sequelize,
  }
);

export default User;
