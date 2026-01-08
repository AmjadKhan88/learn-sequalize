import express from "express";
import { handleMulterError, uploadAvatar } from "../middlewares/upload.js";
import { addUser, deleteUser, getSingleUser, getUser, updateUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";



const userRoutes = express.Router();

// add new user
userRoutes.post('/',isAuth, uploadAvatar,handleMulterError,addUser);

// update single user by id
userRoutes.put('/:id',isAuth, uploadAvatar,handleMulterError,updateUser);

// delete single user by id
userRoutes.delete('/:id',isAuth, deleteUser);

// get single user
userRoutes.get('/:id',isAuth, getSingleUser);

// get all users
userRoutes.get('/',isAuth, getUser);

export default userRoutes;