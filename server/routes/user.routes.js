import express from "express";
import { handleMulterError, uploadAvatar } from "../middlewares/upload.js";
import { addUser, deleteUser, getSingleUser, getUser, updateUser } from "../controllers/user.controller.js";



const userRoutes = express.Router();

// add new user
userRoutes.post('/',uploadAvatar,handleMulterError,addUser);

// update single user by id
userRoutes.put('/:id',uploadAvatar,handleMulterError,updateUser);

// delete single user by id
userRoutes.delete('/:id',deleteUser);

// get single user
userRoutes.get('/:id',getSingleUser);

// get all users
userRoutes.get('/',getUser);

export default userRoutes;