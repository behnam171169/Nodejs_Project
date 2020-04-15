const controller=require('app/http/controlers/controler');
const User=require('app/models/users');
const uniqueString=require('uniq-string');
const passwordReset=require('app/models/password-reset');
class forgetpasswordController extends controller{
    showForm(req,res,next){
res.render('home/auth/password/reset',{messages:req.flash('errors'),success:req.flash('success')});
    }
    async passwordResetLink(req,res,next){
        await this.Recaptchavalidation(req,res);
        var result=await this.validationDate(req);
        if(result) return this.resetLinkProcess(req,res,next);
        else
        res.redirect('/auth/password/reset')
    }
    async resetLinkProcess(req,res,next){
let user=await User.findOne({email:req.body.email});
if(!user){
    console.log('کاربری با این ایمیل در سایت ثبت نام نکرده است')
    req.flash('errors','کاربری با این ایمیل در سایت ثبت نام نکرده است')
    return this.back(req, res);
    // return this.back(req,res);
}
const setpassword=new passwordReset({
    email:req.body.email,
    token:uniqueString()
})
await setpassword.save(err=>{
    console.log(err)
})
console.log('لینک تغییر رمز عبور به ایمیل وارد شده ارسال شده است')
req.flash('success','لینک تغییر رمز عبور به ایمیل وارد شده ارسال شد')

res.redirect('/auth/password/reset')}
}
module.exports=new forgetpasswordController();