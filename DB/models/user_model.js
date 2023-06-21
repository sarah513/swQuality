import {model, Schema}from 'mongoose'

const userSchema=new Schema({
full_name:{type:String,
    required:true
},
user_name:{type:String,
unique:true,
required:true
},
password:{
type:String,
required:true
},
allowed_friends:{
    type:Array,
    default:[] 
},
close_friends:{
    type:Array,
    default:[]
},
allow_share:{
    type:Boolean,
    default:true
},
allow_pedistrian:{
    type:Boolean,
    default:true
},
allow_vehicle:{
    type:Boolean,
    default:true
},
allow_holes_bumps:{
    type:Boolean,
    default:true
},
last_img:{
    type:String
}
},{timestamps:true})

export const userModel=model("User",userSchema)