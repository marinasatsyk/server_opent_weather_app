import Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema({
    firstName: {type: String, trim: true, lowercase: true, required: true},
    lastName: {type: String, trim: true,lowercase: true, trim: true,required: true},
    email: {type: String, lowercase: true,required: true},
    password: {type: String, required: true},
    createdDateTime: {type: Date, required: true},
    role: {type: String, required: true, default: 'user'},
}, {collection: "user"})

const UserModel = Mongoose.model("User", userSchema);

export default UserModel;

