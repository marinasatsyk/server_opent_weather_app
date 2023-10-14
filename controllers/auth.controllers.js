import jwt from "jsonwebtoken";



export function createAccesToken(userId) {
    return jwt.sign(
        {userId: userId}, 
        process.env.JWT_SECRET, 
        { expiresIn: '10m' }
        );
}
export function createrefreshToken(userId, refreshTokenId) {
    return jwt.sign(
        {userId: userId,
        tokenId: refreshTokenId}, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: '30d' }
        );
}



