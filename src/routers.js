import { Router } from "express";
import { userModel } from '../DB/models/user_model.js'
const router = Router()
let doneMessage = (res, result) => {
    return res.json({ message: "DONE", result })
}
let errMessage = (res, err = '', message = '') => {
    return res.json({ error: message, err })
}
router.delete('/dlall',async(req,res,next)=>{
    let dlt= await userModel.deleteMany()
    return doneMessage(res,dlt)

})
router.get('/all',async (req,res,next)=>{
    let dta= await userModel.find()
    return doneMessage(res,dta)
})
//signup 
router.post('/signup', (req, res, next) => {
    const { full_name, user_name, password } = req.body
    userModel.create({ full_name, user_name, password }).
        then(result => {
            return doneMessage(res, result)
        }).catch(
            err => {
                let message = 'this user name already exist'
                return errMessage(res, err, message)
            }
        )

})

router.post('/login', (req, res, next) => {
    const { user_name, password } = req.body
    userModel.findOne({ user_name, password }).then(result => {
        return result ? doneMessage(res, result) : errMessage(res, 'invalid email or password', 'invalid email or password')
    }
    ).catch(err => {
        return errMessage(res, err, 'some error in login process ')
    })
})
router.patch('/setting', (req, res, next) => {
    const { user_name } = req.headers
    const { allow_holes_bumps, allow_vehicle, allow_pedistrian, allow_share } = req.body
    console.log(user_name, { allow_holes_bumps, allow_vehicle, allow_pedistrian, allow_share })
    userModel.findOneAndUpdate({ user_name }, { allow_holes_bumps, allow_vehicle, allow_pedistrian, allow_share }, { new: true }).
        then(result => {
            return result ? doneMessage(res, result) : errMessage(res, 'not logged in', 'not logged in')
        }).catch(err => {
            return errMessage(res, err)
        })
})
router.patch('/addfriend', async (req, res, next) => {
    const {user_name} = req.headers
    const { friend_username } = req.body
    console.log({ user_name, friend_username })
    const userAvaiable = await userModel.findOne({ user_name: friend_username })
    console.log(userAvaiable)
    if (userAvaiable) {
        let user1 = await userModel.findOneAndUpdate({ user_name }, { $addToSet: { close_friends: friend_username } }, { new: true })
        let user2 = await userModel.findOneAndUpdate({ user_name: friend_username }, { $addToSet: { allowed_friends: user_name } }, { new: true })
        return user1 && user2 ? doneMessage(res, { user1, user2 }) : errMessage(res, 'user not found', 'user not found')
    } else {
        return errMessage(res, 'user not found', 'user not found')
    }
    // return res.json({userAvaiable})
})

router.patch('/dltfriend', async (req, res, next) => {
    const { user_name, friend_username } = req.headers
    const user = await userModel.findOne({ user_name })
    // delete friend from close for user 
    let { close_friends } = user
    let newarr = close_friends.filter((friend) => { return friend != friend_username })
    let response = await userModel.findOneAndUpdate({ user_name }, { close_friends: newarr }, { new: true })

    const fuser = await userModel.findOne({ user_name:friend_username })
    let {allowed_friends}=fuser
    let fnewarr = allowed_friends.filter((friend) => { return friend != user_name })
    let fresponse = await userModel.findOneAndUpdate({ user_name:friend_username }, { allowed_friends: fnewarr }, { new: true })
    //delete user from
    return doneMessage(res, response)
})

router.get('/data', async (req, res, next) => {
    const { user_name } = req.headers
    let user = await userModel.findOne({ user_name })
    return doneMessage(res, user)
})

router.post('/save_img', async (req, res, next) => {
    const { user_name, image } = req.body;
    let save = await userModel.findOneAndUpdate({ user_name }, { last_img: image }, { new: true })
    return save ? doneMessage(res, save) : errMessage(res, 'user not found', 'user not found')
})

router.post('/care', async (req, res, next) => {
    const { sender, driver } = req.body
    console.log({ sender, driver })
    let user = await userModel.findOne({ user_name: sender })
    let isFriends = user.allowed_friends.includes(sender)
    console.log(user)
    if (isFriends) {
        const { last_img, updatedAt } = user
        console.log(updatedAt)
        if (last_img) {
            return doneMessage(res, {last_img,updatedAt})
        } else {
            return doneMessage(res, "this user didn't use this app before")
        }
    }
    return doneMessage(res, "user doesn't add you in close friends")
})
export default router