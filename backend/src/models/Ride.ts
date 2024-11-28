import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Driver from "./Driver";

interface RideAttributes {
  id: number;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: number;
  value: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type RideCreationAttributes = Optional<RideAttributes, "id">;

class Ride extends Model<RideAttributes, RideCreationAttributes> implements RideAttributes {
  public id!: number;
  public customer_id!: string;
  public origin!: string;
  public destination!: string;
  public distance!: number;
  public duration!: string;
  public driver_id!: number;
  public value!: number;

  // Campos automáticos do Sequelize
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associação
  public driver?: Driver;
}

Ride.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: DataTypes.STRING,
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

Ride.belongsTo(Driver, { foreignKey: "driver_id", as: "driver" });

export default Ride;
