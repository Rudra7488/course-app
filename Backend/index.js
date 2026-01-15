import express from 'express'
import dotenv from 'dotenv'
import { connectdb } from './Database/db.js'
import courseroutes from './routes/courseroute.js'
import fileUpload from 'express-fileupload'
import { v2 as cloudinary } from 'cloudinary';
import userRoutes from './routes/userroute.js'
import adminroute from './routes/adminroutes.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import orderRoutes from './routes/orderroutes.js'


dotenv.config()


const app=express()

app.use(express.json())
app.use(cookieparser())





app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors())




// routing
app.use('/course',courseroutes)
app.use('/user',userRoutes)
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

