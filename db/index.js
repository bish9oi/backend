import mongoose from "mongoose";
const dbname = "medico";
export const connectDb = async () =>{
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI,{dbName:dbname})
    console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.error("db connection error: ",error);
    process.exit(1);
  }
}