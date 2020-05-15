const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const mongoosePaginate=require('mongoose-paginate');
const course=mongoose.Schema({
    user:{type:Schema.Types.ObjectId,ref:'users'},
    title:{type:String,required:true},
    slug:{type:String,default:''},
    body:{type:String,required:true},
   type:{type:String,required:true},
    images:{type:Object,required:true},
    price:{type:String,required:true},
    time:{type:String,default:"00:00:00"},
    tags:{type:String,required:true},
    viewCount:{type:String,default:0},
    categories:[{type:Schema.Types.ObjectId,ref:'Category'}],
    commentCount:{type:String,default:0},
},{
    timestampts:true,
    toJSON:{virtuals:true}
})
course.virtual('episodes',{
    ref:'Episode',
    localField:'_id',
    foreignField:'course'
})
course.virtual('comment',{
    ref:'Comment',
    localField:'_id',
    foreignField:'course'
})
course.methods.path=function(){
    return `/course/${this.slug}`;
}

course.methods.inc = async function(field, num = 1){
    this[field] += num;
    await this.save()
}
// course.plugin(mongoosePaginate);
module.exports=mongoose.model('course',course)