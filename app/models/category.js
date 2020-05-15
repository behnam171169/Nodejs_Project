const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const mongoosePaginate=require('mongoose-paginate');
const Category=mongoose.Schema({
    name : { type : String , required : true},
    slug : { type : String, required : true},
    parent : { type : Schema.Types.ObjectId, ref : 'Category'}
},{
    timestampts:true,
    toJSON:{virtuals:true}
})

Category.virtual('childs',{
    ref:'Category',
    localField:'_id',
    foreignField:'parent'
})
// course.methods.path=function(){
//     return `/course/${this.slug}`;
// }

// course.methods.inc = async function(field, num = 1){
//     this[field] += num;
//     await this.save()
// }
// course.plugin(mongoosePaginate);
module.exports=mongoose.model('Category',Category)