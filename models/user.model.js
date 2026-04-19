import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class User extends Model { }


User.init(
   {
      name: {
         type: DataTypes.STRING(50),
         allowNull: false,
         unique: false,
      },
      firstname: {
         type: DataTypes.STRING(50),
         allowNull: false,
         unique: false,
      },
      age: {
         type: DataTypes.INTEGER,

      },
      role: {
         type: DataTypes.STRING(50),
      },
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
      },
      password: {
         type: DataTypes.STRING(100),
         allowNull: false,
      },
      avatar: {
         type: DataTypes.TEXT,
         allowNull: true
      },

   },
   {
      sequelize, // je lui passe les infos de connexion
      tableName: "user", // nom de la table en BDD
   }
);

