import express from 'express';
import { getAuth, userLogin, userSignup } from '../controllers/auth.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';


const authRoutes = express.Router();


// for auth or user signup
authRoutes.post('/signup',userSignup);


// for login 
authRoutes.post('/login',userLogin);

// get auth data
authRoutes.get('/',isAuth,getAuth);


export default authRoutes;