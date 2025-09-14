import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.models.js";
import bcrypt from "bcryptjs";
import verifyEmailTeamplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";

export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      })
    }
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.json({
        message: "Already account with this email",
        error: true,
        success: false,
      })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const payload = {
      name,
      email,
      password: hashedPassword,
    }

    const newUser = new UserModel(payload)
    const save = await newUser.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Welcome to Blinkeyit   Verify your email",
      html: verifyEmailTeamplate({
        name,
        url: VerifyEmailUrl

      })
    })
    return res.json({
      message: "User Register Successfully",
      error: false,
      success: true,
      data: save,
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    })
  }
}


export async function verifyEmailContrpoller(req , res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code});
    if (!user) {
      return res.status(400).json({
        message: "Invalid verification code",
        error: true,
        succes: false
     
      })
    } 
    const updateUser = await UserModel.updateOne({_id : code}, {
      verify_email : true
    })
return res.json({
  message : "Email verify successfully",
  error : false,
  succes : true
})
  } catch (error) {
    return res.status(500).json({
      message : error.message ||error,
      error :true,
      succes :false
    })
  }
}



//login controller
export async function loginController(req, res) {
try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
      error: true,
      success: false,
    })
  }

  const user = await UserModel.findOne({email});
  if (!user) {
    return res.status(400).json({
      message: "User not found",
      error: true,
      success: false,
  })
}
if(user.status !== "Active"){
  return res.status(403).json({
    message: `Your account is ${user.status}. Please contact support Team.`,
    error: true,
    success: false,

  })
}


const checkPassword = await bcrypt.compare(password , user.password)
if(!checkPassword){
  return res.status(400).json({
    message: "Invalid credentials",
    error: true,
    success: false,
  })
}

const accessToken = await generatedAccessToken(user._id)
const refreshToken = await generatedRefreshToken(user._id)


const cookieOption = {
  httpOnly :true ,
  secure : true,
  sameSite :"None"
}
res.cookie('accessToken' , accessToken, cookieOption)
res.cookie('refreshToken' , refreshToken, cookieOption)

return res.json({
  message: "Login successfull",
  error :false,
  success : true,
  data : {accessToken,refreshToken }

})

} catch (error) {
  return res.status(500).json({
    message: error.message || error,
    error: true,
    success: false,
  })
}
}

export async function logoutController(req, res) {
  try {
    const userId = req.userId
    const cookieOption = {
  httpOnly :true ,
  secure : true,
  sameSite :"None"
}
    res.clearCookie("accessToken", cookieOption)
    res.clearCookie("refreshToken", cookieOption)

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token : ""
    })
    return res.json({
      message :"Logout Successfull",
      error: false,
      success :true 
    })
  } catch (error) {
    return res.status(500).json({
      message :error.message || error ,
      error :true ,
      success :false
    })
  }
}