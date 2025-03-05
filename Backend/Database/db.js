import mongoose from 'mongoose'


export const connectdb= async ()=>{
    try {
        await mongoose.connect(process.env.DBURL)
        console.log('database connected');
        
    } catch (error) {
        console.log('not connected');
        
        
    }

}