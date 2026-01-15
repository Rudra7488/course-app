

import express from 'express'
import {  buycourses, coursecontroller, courseDetails, deletecontroller, getcontroller,  updatecontroller } from '../controllers/course.controller.js'
import {usermiddleware}from '../Middlewares/usermiddleware.js'
import { adminmiddleware } from '../Middlewares/adminmiddleware.js'




const courseroutes=express.Router()

courseroutes.post('/create',adminmiddleware,coursecontroller)

courseroutes.put('/update/:courseid',adminmiddleware,updatecontroller)

        courseroutes.delete('/delete/:courseid',adminmiddleware,deletecontroller)

courseroutes.get('/view',getcontroller)
courseroutes.get('/:courseId',courseDetails)
courseroutes.post('/courses/:courseId',usermiddleware,buycourses)



export default courseroutes