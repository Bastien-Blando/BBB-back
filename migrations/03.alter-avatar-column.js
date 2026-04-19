import { sequelize } from "../models/index.js";

console.log("🔍 Modification de la colonne avatar...");
await sequelize.query('ALTER TABLE "user" ALTER COLUMN avatar TYPE TEXT;');
console.log("✅ Colonne avatar mise à jour en TEXT");

await sequelize.close();
