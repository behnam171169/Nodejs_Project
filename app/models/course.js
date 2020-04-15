const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const course=mongoose.Schema({
    user:{type:Schema.Types.ObjectId,ref:'User'},
    title:{type:String,required:true},
    slug:{type:String,default:''},
    body:{type:String,required:true},
   type:{type:String,required:true},
    images:{type:Object,required:true},
    price:{type:String,required:true},
    time:{type:String,default:"00:00:00"},
    tags:{type:String,required:true},
    viewCount:{type:String,default:0},
    commentCount:{type:String,default:0},
},{
    timestampts:true
})

module.exports=mongoose.model('course',course)