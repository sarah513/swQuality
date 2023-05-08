import { Router } from "express";
import { userModel } from '../DB/models/user_model.js'
const router = Router()
let doneMessage = (res, result) => {
    return res.json({ message: "DONE", result })
}
let errMessage = (res, err='',message='') => {
    return res.json({error:message, err })
}
//signup 
router.post('/signup', (req, res, next) => {
    const { full_name, user_name, password } = req.body
    userModel.create({ full_name, user_name, password }).
        then(result => {
            return doneMessage(res, result)
        }).catch(
            err => {
                let message='this user name already exist'
                return errMessage(res, err,message)
            }
        )

})

router.post('/login',(req,res,next)=>{
    const {user_name,password}=req.body
    userModel.findOne({user_name,password}).then(result=> {
      return result?  doneMessage(res,result):errMessage(res,'invalid email or password','invalid email or password')}
    ).catch(err=>{
        return errMessage(res,err,'some error in login process ')
    })
})
router.patch('/setting', (req,res,next)=>{
    const {user_name}=req.headers
    const{allow_holes_bumps,allow_vehicle,allow_pedistrian,allow_share}=req.body
    console.log(user_name,{allow_holes_bumps,allow_vehicle,allow_pedistrian,allow_share})
    userModel.findOneAndUpdate({user_name},{allow_holes_bumps,allow_vehicle,allow_pedistrian,allow_share},{new:true}).
    then(result=>{
        return result? doneMessage(res,result): errMessage(res,'not logged in','not logged in')
    }).catch(err=>{
        return errMessage(res,err)
    })
})
router.patch('/addfriend',async(req,res,next)=>{
    const {user_name}=req.headers
    const{friend_username}=req.body
    console.log({user_name,friend_username})
    const userAvaiable=await userModel.findOne({user_name:friend_username}) 
    if(userAvaiable){
        let user=await userModel.findOneAndUpdate({user_name},{ $addToSet: { close_friends: friend_username } },{new:true})
        return user? doneMessage(res,user):errMessage(res,'user not found','user not found')
    }else{
        return errMessage(res,'user not found','user not found')
    }
    // return res.json({userAvaiable})
})

router.patch('/dltfriend',async (req,res,next)=>{
    const {user_name,friend_username}=req.headers
    const user=await userModel.findOne({user_name})
    let {close_friends}=user
    let newarr= close_friends.filter((friend)=>{return friend!=friend_username })
    let response= await userModel.findOneAndUpdate({user_name},{close_friends:newarr},{new:true})
    return doneMessage(res,response)
})

router.get('/data',async(req,res,next)=>{
    const {user_name}=req.headers
    let user= await userModel.findOne({user_name})
    return doneMessage(res,user)
})
export default router