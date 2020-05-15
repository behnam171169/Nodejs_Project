const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const mongoosePagination = require('mongoose-paginate');
const bcrypt = require('bcrypt');
const Episode = mongoose.Schema({
    course : { type : Schema.Types.ObjectId , ref : 'course'},
    number : { type : String , required : true },
    title : { type : String , required : true },
    body : { type : String , required : true },
    type : { type : String , required : true },
    time : { type : String , default : '00:00:00' },
    videoUrl : { type : String , required : true },
    downloadCount : { type : Number , default : 0 },
    commentCount : { type : Number , default : 0 },
    
} , {
    timestamps : true
})

// Episode.plugin(mongoosePagination);

Episode.methods.download = function(req){
    let access = false;
    if(! req.isAuthenticated()) return '#';
    if(this.type == 'free')
        access = true;
    else if(this.type == 'vip')
        access = req.user.isVip();
  else if(this.type=='cash')
  access=req.user.CheckpayCash(this.course);

    const time = new Date().getTime() + 1000 * 3600 * 24;
    const secert = `asdqwoidjopedm!@sdfwe#asd%${this.id}${time}`;
    const salt =  bcrypt.genSaltSync(15);
    const hash =  bcrypt.hashSync(secert, salt);

    return access ? `/download/${this.id}?secret=${hash}&t=${time}` : '#';

}

Episode.methods.inc = async function(field, num = 1){
    this[field] += num;
    await this.save()
}

module.exports = mongoose.model('Episode' , Episode);