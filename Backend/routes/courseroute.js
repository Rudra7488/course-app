

import express from 'express'
import {  buycourses, coursecontroller, courseDetails, deletecontroller, getcontroller,  updatecontroller } from '../controllers/course.controller.js'
import {usermiddleware}from '../Middlewares/usermiddleware.js'
import { adminmiddleware } from '../Middlewares/adminmiddleware.js'




const routes=express.Router()

routes.post('/create',adminmiddleware,coursecontroller)

routes.put('/update/:courseid',adminmiddleware,updatecontroller)

routes.delete('/delete/:courseid',adminmiddleware,deletecontroller)

routes.get('/view',getcontroller)
routes.get('/:courseId',courseDetails)
routes.post('/courses/:courseId',usermiddleware,buycourses)



export default routes