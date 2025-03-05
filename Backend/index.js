import express from 'express'
import dotenv from 'dotenv'
import { connectdb } from './Database/db.js'
import routes from './routes/courseroute.js'
import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary';
import useRoutes from './routes/userroute.js'
import adminroute from './routes/adminroutes.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import orderRoutes from './routes/orderroutes.js'


dotenv.config()


const app=express()
app.get('/kuchbhi',(req,res)=>{
    res.send('created')
})
app.use(express.json())
app.use(cookieparser())




// Configuration
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))




// routing
app.use('/course',routes)
app.use('/user',useRoutes)
app.use('/admin',adminroute)
app.use('/order',orderRoutes)

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key:process.env.api_key, 
    api_secret:  process.env.api_secret
});



  





app.listen(process.env.PORT,()=>{
    console.log(`server is running ${process.env.PORT}`)
    connectdb()
})