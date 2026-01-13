import { Course } from "../models/coursemodel.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchasemodel.js";
import Razorpay from 'razorpay';
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, CURRENCY } from "../config.js";
import dotenv from 'dotenv'
dotenv.config()



export const coursecontroller=async (req,res)=>{
    const adminId=req.adminId
    const {title,description,price,}=req.body;
try{
    if(!title||!description ||!price){
       return res.send('please fill')
    }
    const {image}=req.files;
    if(!req.files ||Object.keys(req.files).length===0 ){
        return res.status(400).json({errors:'no file uploaded'})
    }
    const allowedformat=["image/png","image/jpeg"]
    if(!allowedformat.includes(image.mimetype)){
        return res.status(400).json({error:'please fill allowedformat'})
  
    }
// cloudinary code
const cloudresponse= await cloudinary.uploader.upload(image.tempFilePath)
if(!cloudresponse || cloudresponse.error){
    return res.status(400).json({error:'problem in save in database '})
}

const coursedata={
    title,
    description,
    price,
    image:{
        public_id: cloudresponse.public_id,
        url: cloudresponse.url
    },
    creatorId:adminId

};






    
    const course=await Course.create(coursedata)
    res.status(200).json({
        status:200,
        message:' course create sucessfully',
        course
        
    })
} catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
}

export const updatecontroller=async (req,res)=>{

const adminId=req.adminId
    const {courseid}=req.params
    const {title,description,price,image}=req.body
    console.log(courseid)

    const course={
        title,
        description,
        price,
        image
    }
    
const found= await Course.findById(courseid)
if(!found){
    return res.status(400).json({error:" course not found"})
}
    const coursesearch=await Course.findOneAndUpdate(
        
        
        {_id:courseid,creatorId:adminId



        },

         {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      }
        
        
    
    
    
    );

    if (!coursesearch) {
        return res
          .status(404)
          .json({ errors: "can't update, created by other admin" });
      }
   
res.status(200).json({message:'sucessfully update',coursesearch})

}

export const deletecontroller=async (req,res)=>{
    const adminId=req.adminId

    const {courseid}=req.params
    const found=await Course.findById(courseid)
    if(!found){
        return res.status(400).json({message:"already delete"})
    }
    
    const deletemethod= await Course.findOneAndDelete({_id:courseid,creatorId:adminId})

    if (!deletemethod) {
        return res
          .status(404)
          .json({ errors: "can't delete, created by other admin" });
      }

    res.status(201).json({msg:"sucessfully delete",deletemethod})

}

export const getcontroller=async (req,res)=>{
    try {
        const course=await Course.find()
        res.send({status:200,msg:"sucessgully view the data",course})
        
    } catch (error) {
        console.log('error while view in database')
        
    }
}

export const courseDetails = async (req, res) => {
    const { courseId } = req.params;
    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(200).json({ course });
    } catch (error) {
      res.status(500).json({ errors: "Error in getting course details" });
      console.log("Error in course details", error);
    }
  };









// payment method - Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

export const buycourses=async (req,res)=>{
   
    const{userId}=req
    const {courseId}=req.params
    
    

    try {
         const course=await Course.findById(courseId)
        
         
        
        if(!course){
            return res.status(400).json({error:"not available"})
        }

        const existinguser=await Purchase.findOne({userId,courseId})
       
        if(existinguser){
            return res.status(400).json({errors:"user has already purchased this product"})
        }
      
   // Razorpay order creation
   const amount = course.price * 100; // Razorpay accepts amount in paise
   const options = {
     amount: amount,
     currency: CURRENCY,
     receipt: `rcpt_${Date.now()}` // Max 40 chars
   };
   
   const order = await razorpay.orders.create(options);
   
   res.status(201).json({
       message: "Order created successfully",
       course,
       orderId: order.id,
       amount: order.amount,
       currency: order.currency,
       keyId: RAZORPAY_KEY_ID
     });





       
       
      
       
    }  catch (error) {
        res.status(500).json({ errors: "Error in course buying", details: error.message });
        console.log("error in course buying ", error);
      }
    
    }

    
