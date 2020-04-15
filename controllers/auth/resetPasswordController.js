const controller = require('app/http/controllers/controller')
const User = require('app/models/users');
const passwordReset = require('app/models/password-reset');
const uniqueString = require('unique-string');
class resetPasswordController extends controller {
    showForm(req, res, next){
        res.render('home/auth/password/email' , {messages : req.flash('errors') , success : req.flash('success'),  recaptcha : this.recaptcha.render() })
    }

    async resetPasswordProcess(req, res, next){
        await this.RecaptchaVaildation(req, res);
        let result = await this.validationData(req);
        if(result) return this.resetPassword(req, res, next);
        else
            return this.back(req, res);
    }

    async resetPassword(req, res, next){
        let passwordreset = passwordReset.findOne({ $and : [{email : req.body.email} , { token : req.body.token}]});
        if(! passwordreset ){
            req.flash('errors' , 'اطلاعات وارد شده صحیح نمی باشد');
            return this.back(req, res);
        }

        if(passwordreset.use){
            req.flash('errors' , 'از این لینک قبلا برای تغییر پسورد استفاده شده است');
            return this.back(req, res);
        }

        let user = await User.findOneAndUpdate({ email : req.body.email} , {$set : {password  : req.body.password } })
        if(! user) {
            req.flash('errors' , 'کاربری با این مشخصات در سیستم وجود ندارد');
            return this.back(req, res);
        }

        await passwordReset.update({use : true} , err => {console.log(err) })
        res.redirect('/auth/login');
    }
}

module.exports = new resetPasswordController();