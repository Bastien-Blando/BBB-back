import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Type de fichier non autorisé'));
};

// Multer stocke le fichier en mémoire (buffer)
const upload = multer({ storage: multer.memoryStorage(), fileFilter });

// Middleware qui upload le buffer vers Cloudinary après multer
export function uploadToCloudinary(req, _res, next) {
  if (!req.file) return next();

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'blablabook/avatars', transformation: [{ width: 300, height: 300, crop: 'fill' }] },
    (error, result) => {
      if (error) return next(error);
      req.file.path = result.secure_url;
      next();
    }
  );

  Readable.from(req.file.buffer).pipe(stream);
}

const avatarUpload = upload;
export default avatarUpload;
