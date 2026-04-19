import multer from 'multer';
import path from 'path';
import { mkdirSync } from 'fs';

const uploadDir = process.env.NODE_ENV === 'production'
   ? '/tmp/uploads/avatars'
   : 'uploads/avatars';

mkdirSync(uploadDir, { recursive: true });

const avatarStorage = multer.diskStorage({
   destination: (_req, _file, cb) => cb(null, uploadDir),
   filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'avatar-' + uniqueSuffix + ext);
   }
});

const fileFilter = (_req, file, cb) => {
   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
   if (allowedTypes.includes(file.mimetype)) cb(null, true);
   else cb(new Error('Type de fichier non autorisé'));
};

const avatarUpload = multer({ storage: avatarStorage, fileFilter });

export default avatarUpload;
