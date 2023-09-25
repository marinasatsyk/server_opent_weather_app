import  User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import withAuth from '../withAuth.js'

const saltRounds = 10;


function userRoutes(app) {
    app.get('/user/all', withAuth ,async (req, res)=>{
        const users = await User.find({});

        if(users.code) {
            res.status(users.code).json({err: users})
        }

        res.status(200).json({users})
    })

    app.get('/user/:id', async (req, res)=>{
        const id = req.params.id

        const oneUser = await User.findOne({_id: id});

        if(oneUser.code) {
            res.status(oneUser.code).json({err: oneUser})
        }

        res.status(200).json({user: oneUser})
    })

    app.post("/user/add", async (req, res)=>{
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

        const user = new User(userData);
        const result = await user.save();

        if(result.code) {
            res.status(result.code).json({err: result})
        }

        res.status(200).json({result})
    })

    app.post("/user/login", async (req, res)=>{
        const userExist = await User.findOne({email: req.body.email});
        console.log(userExist)
        if(!userExist) {
            res.status(401).json({err: "Email ou mot de passe incorrect"});
        }
        console.log(req.body.password, userExist.password)
        const compare = await bcrypt.compare(req.body.password, userExist.password);
        console.log(compare)
        if(compare) {
            const payload = {id: userExist._id}
            const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(200).json({msg: 'connecté', token: token})
        } else {
            res.status(401).json({err: "Email ou mot de passe incorrect"});
        }
    })
}

export default userRoutes;