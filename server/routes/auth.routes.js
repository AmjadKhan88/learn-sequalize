import express from 'express';
import { getAuth, userLogin, userLogout, userSignup } from '../controllers/auth.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';


const authRoutes = express.Router();


// for auth or user signup
authRoutes.post('/signup',userSignup);


// for login 
authRoutes.post('/login',userLogin);

// get auth data
authRoutes.get('/',isAuth,getAuth);

// logout
authRoutes.post('/logout',isAuth,userLogout);



export default authRoutes;