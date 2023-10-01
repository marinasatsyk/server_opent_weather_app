"use strict"

/**
 * Module dependecies
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  UserModel from "../models/user.js";
import mongoose from "mongoose";

export const auth = async(req, res) => {
    console.log("in auth")
    const headers = req.headers;
    console.log('headers',headers)
    const user = await UserModel.findOne({_id: req.payload.id});
    res.status(200).json({msg: "token ok", user});
}

export const login = async (req, res) => {
    const userExist = await UserModel.findOne({email: req.body.email});
    console.log("userExist", userExist)
    if(!userExist) {
        res.status(401).json({err: "Email ou mot de passe incorrect"});
    }
    console.log("in login", req.body.password, userExist.password)
    const compare = await bcrypt.compare(req.body.password, userExist.password);
    console.log("compare", compare)
    
    if(compare) {
        const payload = {id: userExist._id}
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({msg: 'connecté', token: token})
    } else {
        res.status(401).json({err: "Email ou mot de passe incorrect"});
    }
}

export const newUser = async(req, res) => {
    console.log("create user request")
        const hash = await bcrypt.hash(req.body.password, saltRounds);
        console.log('hash', hash);
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            createdDateTime: new Date(),
            role: req.body.role 
        }

        console.log("*****userData", userData)

        const user = new UserModel(userData);
        //verifier qu'il n'y pas le même mail
        const result = await user.save();

        if(result.code) {
            res.status(result.code).json({err: result})
        }

        res.status(200).json({result})
}


export const list = async (req, res) =>  {
    const users = await UserModel.find({});

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






