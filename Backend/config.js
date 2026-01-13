import dotenv from 'dotenv'
dotenv.config()

   export const jwt_user_password=process.env.JWT_WEBTOKEN
   export const jwt_admin_password=process.env.JWT_ADMINTOKEN
   export const RAZORPAY_KEY_ID=process.env.RAZORPAY_KEY_ID
   export const RAZORPAY_KEY_SECRET=process.env.RAZORPAY_KEY_SECRET
   export const CURRENCY=process.env.CURRENCY || "INR"


  