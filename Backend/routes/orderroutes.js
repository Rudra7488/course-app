import express from 'express'
import { orderdetails } from '../controllers/ordercontroller.js';
import { usermiddleware } from '../Middlewares/usermiddleware.js';


const orderRoutes= express.Router();
orderRoutes.post('/orderdetails',usermiddleware,orderdetails)


export  default orderRoutes