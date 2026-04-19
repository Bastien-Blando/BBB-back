import { Router } from "express";
import { userController } from "../controllers/index.js";
import { userAuthentificationController } from "../controllers/index.js";
import { authenticate } from '../middlewares/authentification.middleware.js';
import avatarUpload, { uploadToCloudinary } from "../middlewares/uploadAvatar.middleware.js";

export const userRouter = Router();

userRouter.post('/user/register', avatarUpload.single('avatar'), uploadToCloudinary, userAuthentificationController.register);

userRouter.post('/user/login', userAuthentificationController.login);

userRouter.get('/auth/me', authenticate, userAuthentificationController.getMe);

userRouter.post('/user', userController.createUser);

userRouter.get('/users', userController.getUsers);

userRouter.get('/user/:id', userController.getUserById);
