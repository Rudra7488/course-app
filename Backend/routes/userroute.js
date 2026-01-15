import express from 'express'
import { login, logout, purchases, signup } from '../controllers/user.controller.js';
import { usermiddleware } from '../Middlewares/usermiddleware.js';

const userRoutes= express.Router();
userRoutes.post('/signup',signup)
userRoutes.post('/login',login)
userRoutes.get('/logout',logout)
userRoutes.get('/purchase',usermiddleware,purchases)

export default userRoutes;
