import express from 'express'
import { login, logout, purchases, signup } from '../controllers/user.controller.js';
import { usermiddleware } from '../Middlewares/usermiddleware.js';

const useRoutes= express.Router();

useRoutes.post('/signup',signup)
useRoutes.post('/login',login)
useRoutes.get('/logout',logout)
useRoutes.get('/purchase',usermiddleware,purchases)
export  default useRoutes