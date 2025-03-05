import mongoose from "mongoose";

const purchaseSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"Usermodel",
    },

    courseId:{
    type:mongoose.Types.ObjectId,
    ref:"coursemodel",
    }


})

export const Purchase=mongoose.model("purchase",purchaseSchema)