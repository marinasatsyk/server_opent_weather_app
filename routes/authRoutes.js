// import { findOne } from '../models/user.js';
 import User from '../models/user.js';
import withAuth from '../withAuth.js';


function authRoutes(app){
   
    app.get('/checkToken', withAuth,  async(req, res) => {
        const headers = req.headers;
        console.log('headers',headers)

        const user = await User.aggregatefindOne({_id: req.payload.id});
        res.status(200).json({msg: "token ok", user})

    })
}

export default authRoutes;
