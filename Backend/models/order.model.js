import mongoose from 'mongoose'

const orderSchema=new mongoose.Schema({
    email:String,
    userId: String,
    courseId:String,
    paymentId:String,
    amount: Number,
    status: String
    
})


  export const Ordermodel=mongoose.model("order",orderSchema)