"use strict"

/**
 * Module dependecies
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  UserModel from "../models/user.js";
import { createAccesToken, createrefreshToken } from "./auth.controllers.js";
import mongoose from "mongoose";
import RefreshTokenModel from "../models/refreshToken.js";
import { errorHandler, withTransaction } from "../utils/index.js";
import { HttpError } from "../error/HttpError.js";

const SALTROUNDS = 10;

export const auth = async(req, res) => {
    console.log("in auth after check token")
    const headers = req.headers;
    console.log('headers',headers)
    try{
        const user = await UserModel.findOne({_id: req.payload.id});

        res.status(200).json({msg: "token ok", user});
    }catch(err){
        console.error(err);
        res.send("Error connexion");
    }
   
}

export const login = async (req, res) => {
   
    const {email, password} = req.body;
    
    try{
        const userExist = await UserModel.findOne({email: email});
    
        if(!userExist) {
            res.status(401).json({err: "User doesn't exist"});
        }

        console.log("in login", password, email)
    
        const compare = await bcrypt.compare(password, userExist.password);
        console.log("compare", compare)
        
        const ROLES = {
            user: 2001,
            root: 5150
        }

        if(compare) {
            const payload = {
                id: userExist._id, 
                firstName: userExist.firstName, 
                lastName : userExist.lastName
            }
            const token =  jwt.sign(
                payload, 
                process.env.JWT_SECRET, 
                { expiresIn: '30s' }
                );
            const refreshToken =  jwt.sign(
                payload, 
                process.env.REFRESH_TOKEN_SECRET, 
                { expiresIn: '7d' }
                );
            // const allUsers = await UserModel.find();
            // const otherUsers = allUsers.filter(person => person.lastName !=  userExist.lastName);
            // const currentUser = {...userExist, refreshToken};
            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
            res.status(200).json({user: userExist.lastName, roles:  [ROLES[userExist.role]],  accessToken: token})
        } else {
           throw new Error("Invalid credentials");

        }
    }catch(err){
        console.error(err);
        res.status(401).json({err: err.message});
    }
    
}


export const signUp = errorHandler(withTransaction( async(req, res, session) => {
    console.log("create user request start", req.body.password)
    
    const hash = await bcrypt.hash(req.body.password, SALTROUNDS);
    console.log('hash', hash);
    
    const userDoc = UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        createdDateTime: new Date(),
        role: req.body.role 
    }) 

    console.log("*****userDoc", userDoc)

        /**WORKS!! */
        // const user = new UserModel(userDoc);
        /**end */
        //verifier qu'il n'y pas le même mail AVANT save

        const userExist = await UserModel.findOne({email: userDoc.email});

        if(userExist){
            throw new Error("User already exists");
        }else{

            const refreshTokenDoc = RefreshTokenModel({
                owner: userDoc.id
            })


            await userDoc.save({session});
            await refreshTokenDoc.save({session});

            const refreshToken = createrefreshToken(userDoc.id, refreshTokenDoc.id);
            const accessToken = createAccesToken(userDoc.id);
            
            
            // if(result.code) {
            //     res.status(result.code).json({err: result})
            // }
    
          return {
                id: userDoc.id,
                accessToken, 
                refreshToken
            }
        }
}
))  
 


export const list = async (req, res) =>  {
    const users = await UserModel.find({});
console.log(users)
    if(users.code) {
        res.status(users.code).json({err: users})
    }

    res.status(200).json({users})
};


export const home = async(req, res) => {
    const id = req.params.id

        const oneUser = await UserModel.findOne({_id: id});

        if(oneUser.code) {
            res.status(oneUser.code).json({err: oneUser})
        }

        res.status(200).json({user: oneUser})
};






