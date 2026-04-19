import "dotenv/config";
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import { apiRouter } from "./routers/index.js";
import { mkdirSync } from "fs";

const PORT = process.env.PORT || 3000;
const app = express();

// Crée les dossiers uploads uniquement en local (Vercel a un filesystem en lecture seule)
if (process.env.NODE_ENV !== 'production') {
  mkdirSync("uploads/avatars", { recursive: true });
  mkdirSync("uploads/books/images", { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(o => o.trim().replace(/\/$/, ""))
  : ["*"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes("*")) return callback(null, true);
    const allowed = allowedOrigins.some(o => origin.startsWith(o.replace(/\/$/, "")));
    if (allowed) return callback(null, true);
    callback(new Error(`CORS bloqué pour l'origine : ${origin}`));
  },
  credentials: true,
}));

app.use(xss());
app.use('/uploads', express.static('uploads'));
app.use('/covers', express.static('public/covers'));

// Route de santé pour vérifier que l'API tourne
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// Route de diagnostic Cloudinary
app.get('/health/cloudinary', (_req, res) => {
  res.json({
    cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
    api_key: !!process.env.CLOUDINARY_API_KEY,
    api_secret: !!process.env.CLOUDINARY_API_SECRET,
  });
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
