import {
  Model,
  ModelStatic,
  DataTypes,
  Optional,
  BelongsToMany,
  BelongsTo,
} from 'sequelize';
import sequelize from '../database/connection';
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
  Company: ModelStatic<Model>;
  User: ModelStatic<Model>;
  Permission: ModelStatic<Model>;
}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public id!: number;
  public companyId!: number;
  public name!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static Company: BelongsTo;
  static Users: BelongsToMany;
  static Permissions: BelongsToMany;

  public static associate(models: ProjectAssociateModels): void {
    this.Company = Project.belongsTo(models.User, {
      foreignKey: 'companyId',
      targetKey: 'id',
    });
    this.Users = Project.belongsToMany(models.User, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'userId',
    });
    this.Permissions = Project.belongsToMany(models.Permission, {
      through: { model: UserPermission, unique: false },
      foreignKey: 'permissionId',
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
