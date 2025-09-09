import UserModel from "../models/user.models";
import bcrypt from "bcryptjs";
 
export async function registerUserController (req , res){
  try {
    const { name , email , password } = req.body ;
    if(!name || !email || !password){
        return res.status(400).json({
            message : "All fields are required" ,
            error : true ,
            success :false ,     
        }) 
    }
    const user = await UserModel.findOne({ email});

    if(user) {
      return response.json({
        message : "Already account with this email" ,
        error : true ,
        success :false ,     
  
      })
    }
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password , salt)
    

    const payload = {
      name,
      email,
      password : hashedPassword,
    }

const newUser = new UserModel(payload)
const save = await newUser.save()


  } catch (error) {
    return res.status(500).json({
        message :  error.message || error ,
        error :true ,
        success :false ,
    })
  }
}