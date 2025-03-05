import express from 'express'
import { login, logout, signup } from '../controllers/admincontrolleer.js'

const adminroute= express.Router()
adminroute.post('/signup',signup)
adminroute.post('/login',login)
adminroute.get('/logout',logout)

export  default adminroute