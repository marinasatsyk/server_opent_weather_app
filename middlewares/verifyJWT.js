import jwt from 'jsonwebtoken';


// function verifyJWT(req, res, next){
//     console.log('with auth start ')
//     const authHeader = req.authHeader;
//     if(!authHeader){
//         return res.sendStatus(401);
//     }
//     console.log('function with auth', authHeader)//Bearer token

//     try {
//         const payload = jwt.verify(
//             authHeader.authorization, 
//             process.env.JWT_SECRET,
//             (err, decoded) => {
//                 req.user = decoded.id
//                 if(err) return res.sendStatus(403);
//             }); 
//         console.log("payload", payload);

//         req.payload = payload;

//         next();

//     } catch(err) {
//         console.log(err);
//         res.status(403).json({err, msg: "invalid token"})
//     }
// }
function verifyJWT(req, res, next){
    console.log('with auth start ')
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.sendStatus(401);
    }
    console.log('function with auth', authHeader)//Bearer token
    jwt.verify(
        authHeader, 
        process.env.JWT_SECRET,
        (err, decoded) => {
            if(err) {return res.status(403).json({err, msg: "invalid token"})};
            req.user = decoded.id;
            next();
        }
    ); 
}

export default verifyJWT;