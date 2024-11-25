import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Driver extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public vehicle!: string;
  public rating!: number;
  public comment!: string;
  public rate_per_km!: number;
  public min_distance!: number;
}

Driver.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate_per_km: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    min_distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "drivers",
  }
);

export default Driver;
