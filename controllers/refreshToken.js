import jwt from "jsonwebtoken";

import  UserModel from "../models/user.js";
import mongoose from "mongoose";



export const refreshToken =  async(req, res) => {
   
    const cookies = req.cookies;
    if(!cookies?.jwt){
        return res.sendStatus(401);
    }

    console.log(cookies?.jwt);
    
    const refreshToken = cookies.jwt;

    try{
        const userExist = await UserModel.findOne({refreshToken: refreshToken});
        if(!userExist) {
            res.sendStatus(403);//Forbidden
        }
    
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if(err || userExist.id !== decoded.id){
                    return res.sendStatus(403);
                }
                const accessToken = jwt.sign(
                    {
                        id: decoded.id, 
                        firstName: decoded.firstName, 
                        lastName : decoded.lastName
                    },
                    process.env.JWT_SECRET,
                    {expiresIn: '30s'}
                );

                res.json(accessToken);
            }
        )
    
    }catch(err){
        console.error(err);
        res.status(401).json({err: err.message});

    }
    
}
