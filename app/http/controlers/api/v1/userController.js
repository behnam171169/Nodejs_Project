const controller=require('app/http/controlers/controler');
const Course=require('app/models/course');
const jwt=require('jsonwebtoken');
const passport = require('passport');
class userController extends controller {

    async login(req, res) {
        passport.authenticate('local.login', { session : false }, (err, user) => {
            if(err) return res.json({
                data : 'مشکلی برای ورود به حساب کاربری به وجود آمده است لطفا شکیبا باشید',
                status : 'error'
            })

            if (!user) return res.json({
                data : 'چنین کاربری در سیستم ثبت نام نکرده است',
                status : 'error'
            })

            req.login(user,{ session : false } ,async err => {
                if (err) return res.json({
                    data : 'امکان ورود به حساب کاربری وجود ندارد',
                    status : 'error'
                })

                const token = await jwt.sign({ _id : req.user.id },'secertKey' , { expiresIn : 60 * 60 * 24 * 3 })
                return res.json({
                    data : token,
                    status : 'success'
                })
            })
        })(req, res)
    }

    // async user(req, res, next) {
    //     const user = await req.user.populate([ { path : 'roles', select : 'name label', populate  : [ { path : 'permissions', select : 'name label'} ]} , { path : 'payCash' , populate : [ { path : 'categories' } ]}]).execPopulate();
    //     res.json({
    //         data : this.filterUserData(user),
    //         status : 'success'
    //     })
    // }

    // filterUserData(user) {
    //     return {
    //         id : user.id,
    //         name : user.name,
    //         email : user.email,
    //         roles : user.roles.map(role => {
    //             return {
    //                 name : role.name,
    //                 label : role.label,
    //                 permissions : role.permissions.map(permission => {
    //                     return {
    //                         name : permission.name,
    //                         label : permission.label
    //                     }
    //                 })
    //             }
    //         }),
    //         createdAt : user.createdAt,
    //         updatedAt : user.updatedAt
    //     }
    // }

}



module.exports = new userController();