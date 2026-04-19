import "dotenv/config";
import pg from "pg";
import { Sequelize } from "sequelize";

if (!process.env.DB_URL) {
  throw new Error("DB_URL est manquante dans les variables d'environnement");
}

export const sequelize = new Sequelize(
   process.env.DB_URL,
   {
      dialect: "postgres",
      dialectModule: pg,
      logging: false,
      define: {
         createdAt: "created_at",
         updatedAt: "updated_at",
         underscored: true,
      }
   }
);
