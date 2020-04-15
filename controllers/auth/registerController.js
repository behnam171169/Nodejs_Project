const controller = require('app/http/controllers/controller')
const passport = require('passport');

class registerController extends controller {
    showForm(req,res){
        res.render('home/auth/register' , {messages : req.flash('errors'), recaptcha : this.recaptcha.render()})
    }

    registerProccess(req,res,next){
        this.RecaptchaVaildation(req, res)
            .then(result => this.validationData(req))
            .then(result => {
                if(result) this.register(req,res,next);
                else
                    res.redirect('/auth/register')
            })
    }

    register(req,res,next){
        passport.authenticate('local.register' , {
            successRedirect : '/',
            failureRedirect : '/auth/register',
            failureMessage : true
        })(req,res,next)
    }
}


module.exports = new registerController();