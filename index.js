import  {connect_to_DB} from './DB/connection.js'
import userRouter from './src/routers.js'
import express from 'express'
import cors from 'cors'
const app= express()
app.use(cors());
app.use(express.json({}))
app.use(userRouter)
app.listen(5000,()=>{
    console.log("listen")
})
connect_to_DB()