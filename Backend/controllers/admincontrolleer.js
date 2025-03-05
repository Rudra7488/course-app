
import bcrypt from 'bcrypt'
import {z, ZodError} from 'zod'
import jwt from 'jsonwebtoken'
import { adminmodel } from '../models/adminmodel.js'
import { jwt_admin_password } from '../config.js'

export const signup=async (req,res)=>{
    
    const {firstname,lastname,email,password}=req.body

    console.log(firstname)

    







    const adminSchema=z.object({
        firstname:z.string().min(3,{message:"firstname must be atleast 3 char long"}),
        lastname:z.string().min(3,{ message:"lastname must be atleast 3 char long"}),
        email:z.string().email(),
        password:z.string().min(6,{message:"firstname must be atleast 3 char long"}),

    });
    const validateData=adminSchema.safeParse(req.body)
    if(!validateData.success){
        return res.status(400).json({errors:validateData.error.issues.map((err)=>err.message)})

    }
    


   const hashpassword= await bcrypt.hash(password,10)
  

    
    try {


        const existingemail= await adminmodel.findOne({email:email})
        if(existingemail){
            return res.status(400).json({error:'already email exist'})
        }
        const newuser=new adminmodel({
            firstname,
            lastname,
            email,
            password:hashpassword

        })
        await newuser.save();

        res.status(200).json({message:"signup succeed ",newuser})
        
    } catch (error) {
        res.status(400).json({message:"error while signup"})
        
    }




  }


  export const login =async (req,res)=>{
  const {email,password}=req.body

  const admin=await adminmodel.findOne({email:email})
  const ispassword=await bcrypt.compare(password,admin.password)

  if( !admin || !ispassword){
    return res.status(401).json({error:"wrong credentials"})
  }
// jwt code
  const token=jwt.sign({
    id:admin._id

  },jwt_admin_password);

  const cookieoption={
    expires:new Date(Date.now() +24 * 60 * 60 *1000),

    httpOnly:true,
    secure:process.env.NODE_ENV==="production", // true for https only

    sameSites:"Strict" // csrf attacks
  }




  res.cookie("jwt",token,cookieoption)


res.send({message:"login sucessfully",admin,token})

 
}

   export const logout=(req,res)=>{
    
   try {
    if(!req.cookies.jwt){
        return res.send({error:"kindly login first "})
    }

    res.clearCookie("jwt")
    res.status(200).json({message:"sucessfully logout"})
    
   } catch (error) {
    console.log(error)
    
   }
   }
  
