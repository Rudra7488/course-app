import { z } from "zod";
import bcrypt from 'bcryptjs'
import { Usermodel} from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { jwt_user_password } from "../config.js";
import { Course } from "../models/coursemodel.js";
import { Purchase } from "../models/purchasemodel.js";





export const signup=async (req,res)=>{
  
    const {firstname,lastname,email,password}=req.body


    
    







    const userSchema=z.object({
        firstname:z.string().min(3,{message:"firstname must be atleast 3 char long"}),
        lastname:z.string().min(3,{ message:"lastname must be atleast 3 char long"}),
        email:z.string().email(),
        password:z.string().min(6,{message:"password must be atleast 3 char long"}),

    });
    const validateData=userSchema.safeParse(req.body)
    if(!validateData.success){
        return res.status(400).json({errors:validateData.error.issues.map((err)=>err.message)})

    }
    


   const hashpassword= await bcrypt.hash(password,10)


    
    try {


        const existingemail= await Usermodel.findOne({email:email})
        if(existingemail){
            return res.status(400).json({errors:'already email exist'})
        }
        const newuser=new Usermodel({
            firstname,
            lastname,
            email,
            password:hashpassword

        })
        await newuser.save();

        res.status(200).json({message:"signup succeed ",newuser})
        
    } catch (error) {
        res.status(400).json({errors:"error while signup"})
        
    }




  }


  export const login =async (req,res)=>{
  const {email,password}=req.body

  const user=await Usermodel.findOne({email:email})
  
  const ispassword=await bcrypt.compare(password, user.password)

  if( !user || !ispassword){
    return res.status(401).json({error:"wrong credentials"})
  }
// jwt code
  const token=jwt.sign({
    id:user._id

  },jwt_user_password);

  const cookieoption={
    expires:new Date(Date.now() +24 * 60 * 60 *1000),

    httpOnly:true,
    secure:process.env.NODE_ENV==="production", // true for https only

    sameSites:"Strict" // csrf attacks
  }




  res.cookie("jwt",token,cookieoption)


res.send({message:"login sucessful",user,token})

 
}

export const logout=(req,res)=>{
    
  try {
   if(!req.cookies.jwt){
       return res.send({errors:"kindly login first "})
   }

   res.clearCookie("jwt")
   res.status(200).json({message:"sucessfully logout"})
   
  } catch (error) {
   console.log(error)
   
  }
}
  

   export const purchases=async(req,res)=>{
   
    

    const userId = req.userId;
    

  try {
    const purchased = await Purchase.find({userId})
    
    if(purchased.length===0){
      return res.send({message:"empty database"})
    }
   

    let purchasedCourseId = [];

    for (let i = 0; i < purchased.length; i++) {
      purchasedCourseId.push(purchased[i].courseId);
    }
    const courseData = await Course.find({
      _id: { $in: purchasedCourseId },
    });

    res.status(200).json({ purchased, courseData });
  } catch (error) {
    res.status(500).json({ errors: "Error in purchases" });
    console.log("Error in purchase", error);
  }

    
   }