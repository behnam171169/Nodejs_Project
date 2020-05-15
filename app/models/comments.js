const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const Comment = mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course', default: undefined },
    // article: { type: Schema.Types.ObjectId, ref: 'Article', default: undefined },
    comment: { type: String, required: true },
    check: { type: Boolean, default: false },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }
}, {
        timestampts: true,
        toJSON: { virtuals: true }
    })
Comment.virtual('comments',{
    ref:'Comment',
    localField:'_id',
    foreignField:'parent'
})

// Comment.plugin(mongoosePaginate);

// Comment.virtual('comments', {
//     ref: 'Comment',
//     localField: '_id',
//     foreignField: 'parent'
// })

Comment.virtual('autoSection', {
    ref: 'course',
 
    localField:'course', 

    foreignField: '_id',
 
})
Comment.methods.inc = async function(field, num = 1){
    this[field] += num;
    await this.save()
}
// Comment.virtual('autoSection', {
//     ref: doc => {
//         if (doc.course)
//             return 'course'
//         else if (doc.article)
//             return 'Article'
//     },
//     localField: doc => {
//         if (doc.course)
//             return 'course'
//         else if (doc.article)
//             return 'article'
//     },

//     foreignField: '_id',
//     justOne : true
// })

module.exports = mongoose.model('Comment', Comment);