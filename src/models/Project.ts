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
import ProjectPermission from './ProjectPermission';
import User from './User';
import UserProjectPermission from './UserProjectPermission';

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
  ProjectPermission: ModelStatic<ProjectPermission>;
  UserProjectPermission: ModelStatic<UserProjectPermission>;
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
  public readonly ProjectPermissions?: ProjectPermission[];
  public static associations: {
    Company: BelongsTo;
    Users: BelongsToMany;
    ProjectPermissions: BelongsToMany;
    UserProjectPermission: HasMany;
  };

  public static associate(models: ProjectAssociateModels): void {
    this.associations.Company = Project.belongsTo(models.Company, {
      foreignKey: 'companyId',
      targetKey: 'id',
    });
    this.associations.Users = Project.belongsToMany(models.User, {
      through: { model: UserProjectPermission, unique: false },
      foreignKey: 'projectId',
      otherKey: 'userId',
    });
    this.associations.ProjectPermissions = Project.belongsToMany(
      models.ProjectPermission,
      {
        through: { model: UserProjectPermission, unique: false },
        foreignKey: 'projectId',
        otherKey: 'permissionId',
      }
    );
    this.associations.UserProjectPermission = Project.hasMany(
      models.UserProjectPermission,
      {
        sourceKey: 'id',
        foreignKey: 'projectId',
      }
    );
  }

  public static addScopes(): void {
    Project.addScope('withUsers', {
      include: {
        association: Project.associations.Users,
        through: { attributes: [] },
        include: [
          {
            association: User.associations.ProjectPermissions,
            through: { attributes: [] },
            include: [
              {
                association: ProjectPermission.associations.Projects,
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
        Sequelize.col('`Users->ProjectPermissions->Projects`.`id`'),
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
