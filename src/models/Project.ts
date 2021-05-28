import {
  Model,
  ModelStatic,
  DataTypes,
  Optional,
  BelongsToMany,
  BelongsTo,
  HasMany,
  Op,
  Sequelize,
} from 'sequelize';
import sequelize from '../database/connection';
import Company from './Company';
import Permission from './Permission';
import User from './User';
import UserPermission from './UserPermission';

interface ProjectAttributes {
  id: number;
  companyId: number;
  name: string;
  description: string | null;
}

export interface ProjectCreationAttributes
  extends Optional<ProjectAttributes, 'id'> {}

interface ProjectAssociateModels {
  Company: ModelStatic<Company>;
  User: ModelStatic<User>;
  Permission: ModelStatic<Permission>;
  UserPermission: ModelStatic<UserPermission>;
}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public id!: number;
  public companyId!: number;
  public name!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Company?: Company;
  public readonly Users?: User[];
  public readonly Permissions?: Permission[];
  public static associations: {
    Company: BelongsTo;
    Users: BelongsToMany;
    Permissions: BelongsToMany;
    UserPermissions: HasMany;
  };

  public static associate(models: ProjectAssociateModels): void {
    this.associations.Company = Project.belongsTo(models.Company, {
      foreignKey: 'companyId',
      targetKey: 'id',
    });
    this.associations.Users = Project.belongsToMany(models.User, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'projectId',
      otherKey: 'userId',
    });
    this.associations.Permissions = Project.belongsToMany(models.Permission, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'projectId',
      otherKey: 'permissionId',
    });
    this.associations.UserPermissions = Project.hasMany(models.UserPermission, {
      sourceKey: 'id',
      foreignKey: 'projectId',
    });
  }

  public static addScopes(): void {
    Project.addScope('withUsers', {
      include: {
        association: Project.associations.Users,
        through: { attributes: [] },
        include: [
          {
            association: User.associations.Permissions,
            through: { attributes: [] },
            include: [
              {
                association: Permission.associations.Projects,
                required: false,
                through: { attributes: [] },
                attributes: [],
                where: {
                  id: { [Op.col]: 'Project.id' },
                },
              },
            ],
          },
        ],
      },
      where: Sequelize.where(
        Sequelize.col('`Users->Permissions->Projects`.`id`'),
        Op.not,
        null
      ),
    });
  }
}

Project.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'projects',
    sequelize,
  }
);

export default Project;
