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
import ProjectPermission from './ProjectPermission';
import Project from './Project';
import UserProjectPermission, {
  UserProjectPermissionAttributes,
} from './UserProjectPermission';

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
  projectPermissions?: Omit<UserProjectPermissionAttributes, 'userId'>[] | null;
}

interface UserAssociateModels {
  Company: ModelStatic<Company>;
  Project: ModelStatic<Project>;
  ProjectPermission: ModelStatic<ProjectPermission>;
  UserProjectPermission: ModelStatic<UserProjectPermission>;
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
  public readonly ProjectPermissions?: ProjectPermission[];
  public static associations: {
    Company: BelongsTo;
    Projects: BelongsToMany;
    ProjectPermissions: BelongsToMany;
    UserProjectPermissions: HasMany;
  };

  public static associate(models: UserAssociateModels): void {
    this.associations.Company = User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      targetKey: 'id',
    });
    this.associations.Projects = User.belongsToMany(models.Project, {
      through: { model: UserProjectPermission, unique: false },
      foreignKey: 'userId',
      otherKey: 'projectId',
    });
    this.associations.ProjectPermissions = User.belongsToMany(
      models.ProjectPermission,
      {
        through: { model: UserProjectPermission, unique: false },
        foreignKey: 'userId',
        otherKey: 'permissionId',
      }
    );
    this.associations.UserProjectPermissions = User.hasMany(
      models.UserProjectPermission,
      {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'projectPermissions',
      }
    );
  }

  public static addScopes(): void {
    User.addScope('withProjects', {
      include: {
        association: User.associations.Projects,
        through: { attributes: [] },
        include: [
          {
            association: Project.associations.ProjectPermissions,
            through: { attributes: [] },
            include: [
              {
                association: ProjectPermission.associations.Users,
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
        Sequelize.col('`Projects->ProjectPermissions->Users`.`id`'),
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
