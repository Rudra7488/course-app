import jwt from 'jsonwebtoken'
import { jwt_user_password } from '../config.js';

 export const usermiddleware=(req,res,next)=>{
    
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,jwt_user_password);
    
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ errors: "Invalid token or expired" });
    
  }

}

