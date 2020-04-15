const Recaptcha=require('express-recaptcha').RecaptchaV2;
const controler=require('app/http/controlers/controler');
const passport = require('passport');
const localStrategy=require('passport-local');
const User=require('./../../models/users');
class loginController extends controler{
showForm(req,res,next){
    res.render('home/auth/login');
}
    async loginProcess(req,res,next){
        // await   this.validationRecaptcha(req,res);
      const result=await this.validationForm(req,res);
       if(result){
        this.login(req,res,next)
       }else{
        res.redirect('/auth/login');
       }
   
}
async login(req,res,next){
    passport.authenticate('local.login',(err,user)=>{
      if(!user){
          
           return res.redirect('/auth/login')
        
        }else{

    req.login(user,err=>{
      console.log(req.body.remember)
          if(err)
           {console.log(err)}
     if(req.body.remember){
    user.setRememberToken(res);
     }
            
          console.log('وارد شدید')
            return res.redirect('/')
          
        
      }) 

      }
  
    })(req,res,next)
}
}

module.exports=new loginController();