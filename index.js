import "dotenv/config";
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import { apiRouter } from "./routers/index.js";
import { mkdirSync } from "fs";

const PORT = process.env.PORT || 3000;
const app = express();

// Crée les dossiers uploads si absents (évite un crash au démarrage)
mkdirSync("uploads/avatars", { recursive: true });
mkdirSync("uploads/books/images", { recursive: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

app.use(xss());
app.use('/uploads', express.static('uploads'));

// Route de santé pour vérifier que l'API tourne
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

app.use(apiRouter);

// Gestionnaire d'erreurs global
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`BlaBlaBook 📘📗📕 is "reading" 👍 on http://localhost:${PORT}`);
  });
}

export default app;
