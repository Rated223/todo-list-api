import bcrypt from 'bcrypt';
import {
  Model,
  ModelStatic,
  DataTypes,
  Optional,
  BelongsTo,
  BelongsToMany,
  HasMany,
  Op,
  Sequelize,
} from 'sequelize';
import sequelize from '../database/connection';
import Company from './Company';
import Permission from './Permission';
import Project from './Project';
import UserPermission, { UserPermissionAttributes } from './UserPermission';

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

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
  permissions?: Omit<UserPermissionAttributes, 'userId'>[] | null;
}

interface UserAssociateModels {
  Company: ModelStatic<Company>;
  Project: ModelStatic<Project>;
  Permission: ModelStatic<Permission>;
  UserPermission: ModelStatic<UserPermission>;
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

  public readonly Company?: Company;
  public readonly Projects?: Project[];
  public readonly Permissions?: Permission[];
  public static associations: {
    Company: BelongsTo;
    Projects: BelongsToMany;
    Permissions: BelongsToMany;
    UserPermissions: HasMany;
  };

  public static associate(models: UserAssociateModels): void {
    this.associations.Company = User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      targetKey: 'id',
    });
    this.associations.Projects = User.belongsToMany(models.Project, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'userId',
      otherKey: 'projectId',
    });
    this.associations.Permissions = User.belongsToMany(models.Permission, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'userId',
      otherKey: 'permissionId',
    });
    this.associations.UserPermissions = User.hasMany(models.UserPermission, {
      sourceKey: 'id',
      foreignKey: 'userId',
      as: 'permissions',
    });
  }

  public static addScopes(): void {
    User.addScope('withProjects', {
      include: {
        association: User.associations.Projects,
        through: { attributes: [] },
        include: [
          {
            association: Project.associations.Permissions,
            through: { attributes: [] },
            include: [
              {
                association: Permission.associations.Users,
                required: false,
                through: { attributes: [] },
                attributes: [],
                where: {
                  id: { [Op.col]: 'User.id' },
                },
              },
            ],
          },
        ],
      },
      where: Sequelize.where(
        Sequelize.col('`Projects->Permissions->Users`.`id`'),
        Op.not,
        null
      ),
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
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
