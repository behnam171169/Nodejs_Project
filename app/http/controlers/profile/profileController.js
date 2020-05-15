const controller=require('app/http/controlers/controler');
const User = require('app/models/users');
class profileController extends controller{
    async index(req, res, next){
        const profile = await User.findById(req.user.id).populate([{ path : 'courses'} , { path : 'comments'} ]).exec();
        
        res.render('admin/profile/index', { profile });
    }

    async updateProfile(req, res, next){
        if(req.body.email)
            req.body.email = req.user.email
        
        await User.findByIdAndUpdate(req.params.id, { $set : { ...req.body }});
        return this.back(req, res);
    }
}

module.exports = new profileController();