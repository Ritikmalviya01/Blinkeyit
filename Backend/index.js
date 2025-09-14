import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet, { crossOriginResourcePolicy } from 'helmet';
import cookieParser from 'cookie-parser';
import connectDb from './config/connectDb.js';
import userRouter from './routes/user.route.js';


dotenv.config()

const app = express();


app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet( {
    crossOriginResourcePolicy : false
}
))


const PORT = 8000 || process.env.PORT

app.get("/", (req,res) =>{
    res.json({message: "Hello from server " + PORT})
})

app.use('/api/user' , userRouter )


connectDb().then(() => {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
})

