const passport = require('passport');
const User=require('./../models/users');
const localStrategy=require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });



passport.use('local.register',new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true,
},(req,email,password,done)=>{
User.findOne({'email':email},(err,user)=>{
    if(err) {return done(err);}
    
    if(user) {console.log('کاربری با این مشخصات قبلا ثبت نام کرده است')}   else
    // {return done(null,false,req.flash('errors','کاربری با این مشخصات قبلا در سایت ثبتنام کرده است'));
  

  
    {
      const adduser=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    });
    adduser.save((err)=>{
        
      if(err) return done(null,false,req.flash('errors','امکان ثبت اطلاعات کاربر وجود ندارد'))
      else{
        done(null,adduser)
      }
 
  })
    }

})
}))




passport.use('local.login',new localStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true,
}
,(req,email,password,done)=>{
User.findOne(
  {'email':email},(err,user,res)=>{
  if(err) {return done(err);}
  
  if(!user ||!user.comparePassword(password)) 
  {

    console.log('کاربری با این مشخصات ثبت نام نکرده است')
  } 
  // return done(null,false,req.flash('errors','کاربری با این مشخصات ثبت نام نکرده است'));
  else

  {
    const adduser=new User({
      name:req.body.name,
      email:req.body.email,
      password:req.body.password
  });
  adduser.save((err)=>{
      
    if(err) return done(null,false)
    else{
      done(null,adduser)
    }
})
  }


}
)}

));