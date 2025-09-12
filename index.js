import app from "./app.js";
import { connectDb } from "./db/index.js";
import dotenv from 'dotenv';
dotenv.config()


connectDb().then(res=>{
    app.listen(process.env.PORT,()=>{
         console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
}).catch(err =>{
    console.error("Db connection failed: ",err)
})