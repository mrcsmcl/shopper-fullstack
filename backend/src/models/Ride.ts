import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Ride extends Model {
  public id!: number;
  public customer_id!: string;
  public origin!: string;
  public destination!: string;
  public distance!: number;
  public duration!: string;
  public driver_id!: number;
  public value!: number;
}

Ride.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "rides",
  }
);

export default Ride;
