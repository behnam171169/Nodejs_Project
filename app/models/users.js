const mongoose=require('mongoose');
const uniqueString = require('unique-string');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const User=mongoose.Schema({
    admin:{type:Boolean,default:false},
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    roles:[{type:Schema.Types.ObjectId,ref:'Role'}],
    payCash:[{type:Schema.Types.ObjectId,ref:'Course'}],
    rememberToken:{type:String,default:''},

},{
    timestampts:true,
    toJSON:{virtuals:true}
})

User.methods.hasRoles=function(roles){
    let result=roles.filter(role=>{
        return this.roles.indexOf(role) >-1
    })
    return !! result.length
}

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
User.virtual('courses',{
    ref:'course',
    localField:'_id',
    foreignField:'user'
})



User.virtual('comments', {
    ref : 'Comment',
    localField : '_id',
    foreignField : 'user'
})
User.methods.isVip = function(){
    return false;
}
// User.methods.payCash = function(){
//     return false;
// }
User.methods.checkpayCash=function(courseId){
return this.payCash.indexOf(courseId) !== -1;
}
module.exports=mongoose.model('users',User)