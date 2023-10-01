import jwt from 'jsonwebtoken';


function withAuth(req, res, next){
    console.log('with auth')
    const headers = req.headers;
    console.log('function with auth', headers)
    try {
        const payload = jwt.verify(headers.authorization, process.env.JWT_SECRET); //trouver comment verifier jwt d'utilisateur
        console.log("payload", payload);

        req.payload = payload;

        next();

    } catch(err) {
        console.log(err);
        res.status(401).json({err, msg: "invalid token"})
    }
}

export default withAuth;