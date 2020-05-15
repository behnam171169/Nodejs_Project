const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const Payment = mongoose.Schema({
    user : { type : Schema.Types.ObjectId, ref : 'User' },
    course : {type : Schema.Types.ObjectId, ref : 'course', default : null },
    vip : { type : Boolean, default : false},
    payment : { type : Boolean , default : false},
    resnumber : { type : String , required : true},
    price : { type : Number, required : true}
} , {
    timestamps : true,
    toJSON : { virtuals : true}
})


// Payment.plugin(mongoosePaginate);

module.exports = mongoose.model('Payment' , Payment);