import mongoose from "mongoose";

export const  connect_to_DB=()=>{
 mongoose.connect(`mongodb+srv://safty_project:safty_project@cluster0.2p1k44o.mongodb.net/safty_project`).then(res=>{
    console.log("done")
 }).catch(err=>{
    console.log(err)
 })
}