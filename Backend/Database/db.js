import mongoose from 'mongoose'


export const connectdb= async ()=>{
    try {
       mongoose.connect(process.env.DBURL || "mongodb+srv://rudrs3780_db_user:zK77lC9OB61femMR@cluster0.uqdpoqq.mongodb.net/Jira-crud")
        console.log('database connected');
        
    } catch (error) {
        console.log('not connected');
        
        
    }

}
