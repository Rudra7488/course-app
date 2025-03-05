import jwt from 'jsonwebtoken'
import { jwt_admin_password } from '../config.js';

 export const adminmiddleware=(req,res,next)=>{
    
    const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,jwt_admin_password);
    
    req.adminId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ errors: "Invalid token or expired" });
    
  }

}

