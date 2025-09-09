import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is not defined in env file ");
}

async function connectDb(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log( " Mongodb connected successfully");
    } catch (error) {
        console.log("Mongodb connection error: ", error);
        process.exit(1)
    }
}
export default connectDb;