const {validationResult}=require('express-validator');
const autoBind=require('auto-bind');
const sprintf=require('sprintf');
 const Recaptcha=require('express-recaptcha').RecaptchaV2;
 module.exports= class controller{
    constructor(){
        autoBind(this);
        this.setRecaptcha();
    }
    setRecaptcha(){
        this.recaptcha=new Recaptcha(config.service.RECAPTCHA.SITE_KEY,config.service.RECAPTCHA.SECRET_KEY,{...config.service.RECAPTCHA.OPTION})
      }
    async  validationRecaptcha(req,res){
return new Promise((resolve,reject)=>{
this.recaptcha.verify(req,(err)=>{
    if(err){
        console.log('err recaptcha')
        // req.flash('errors','گزینه امنیتی فعال نمی باشد');
        this.back(req,res);
    }else{
       resolve(true)
       console.log('ok recaptcha')
    }
})
})
      }
 async validationForm(req,res){
    const result=await validationResult(req);
    if(!result.isEmpty()){
        const errors=result.array();
        console.log(errors);
        const messages=[];
        errors.forEach(err=>{messages.push(err.msg)});
        req.flash('errors',messages);
     this.back(req,res);
        console.log('error validate')
        return false
    }else{
        return true
        console.log('ok validate')
    }
}
back(req,res){
    return res.redirect(req.header('Referer') || '/');
}
getTime(episodes) {
    let second = 0;
    episodes.forEach(episode => {
        let time = episode.time.split(":");
        if (time.length === 2) {
            second += parseInt(time[0]) * 60;
            second += parseInt(time[1]);
        } else if (time.length === 3) {
            second += parseInt(time[0]) * 3600;
            second += parseInt(time[1]) * 60;
            second += parseInt(time[2]);
        }
    });

    let hour = Math.floor(second / 3600);
    console.log(hour,'lllllllll');
    let minute = Math.floor((second / 60) % 60);
    second = Math.floor(second % 60);

    return sprintf("%02d:%02d:%02d", hour, minute, second);
}
}