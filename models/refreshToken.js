import Mongoose, { Schema } from 'mongoose';

const refreshTokenSchema = new Mongoose.Schema(
    {owner:{type: Schema.Types.ObjectId, ref: 'User'}}
    )


const RefreshTokenModel = Mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
