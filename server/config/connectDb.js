import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected successfully");
    }catch(error){
        console.log(`Database error: ${error}`);
    }
}

export default connectDb