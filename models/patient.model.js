import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const patientSchema = new mongoose.Schema({
     username:{
        type: String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email:{
        type: String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type: String,
        required:true,
        index:true,
        trim:true,
    },
    password:{
        type: String,
        required:true,
    },
    refreshToken:{
        type: String,

    }
},{timestamps:true})


patientSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,8)
    next();
})

patientSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

patientSchema.methods.generateAccessToken = async function () {
   return jwt.sign({
        _id : this._id,
        username: this.username,
        email: this.email,
        fullname:this.fullname,
        entity: this.entity
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

patientSchema.methods.generateRefreshToken = async function () {
   return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const Patient = mongoose.model("Patient",patientSchema);