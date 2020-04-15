const mongoose=require('mongoose');
const uniqueString = require('unique-string');
const bcrypt = require('bcrypt');
const User=mongoose.Schema({
    admin:{type:Boolean,default:false},
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    rememberToken:{type:String,default:''}
},{
    timestampts:true
})
User.pre('save',function(next){
   let salt=bcrypt.genSaltSync(15);
    let hash=bcrypt.hashSync(this.password,salt);
    this.password=hash;
    next();
})
User.pre('findOneAndUpdate',function(next){
    let salt=bcrypt.genSaltSync(15);
    let hash=bcrypt.hashSync(this.getUpdate().$set.password,salt);
    this.getUpdate().$set.password=hash;
    next();
})
User.methods.comparePassword=function(password){
    return bcrypt.compareSync(password,this.password)
}
User.methods.setRememberToken=function(res){
    const token=uniqueString();
    res.cookie('remember_token',token,{maxAge:1000*60*60*24*6,httpOnly:true,signed:true});
    this.updateOne({rememberToken:token},err=>{
        if(err) console.log(err);
    })
}
module.exports=mongoose.model('users',User)