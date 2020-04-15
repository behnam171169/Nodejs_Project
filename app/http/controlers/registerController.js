const User=require('./../../models/users');

const Recaptcha=require('express-recaptcha').RecaptchaV2;
const controler=require('app/http/controlers/controler');
const passport = require('passport');
const localStrategy=require('passport-local');
class  registerConteroller extends controler{
    
        showForm(req,res){
        res.render('./home/auth/register',{messages:req.flash('errors'),recaptcha:this.recaptcha.render()});
    }
   async  registerProcess(req,res,next){
    await   this.validationRecaptcha(req,res);
  const result=await this.validationForm(req,res);
   if(result){
    this.register(req,res,next)
   }else{
    res.redirect('/auth/register');
   }
    }  
    register(req,res,next){
    passport.authenticate('local.register', { successRedirect: '/',
      failureRedirect: '/auth/register',
      failureMessage : true })(req,res,next)
}
}
module.exports=new registerConteroller;
