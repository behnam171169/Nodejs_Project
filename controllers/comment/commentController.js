const controller = require('app/http/controllers/controller');
const Comment = require('app/models/comment');
class commentController extends controller {
    async index(req, res, next){
        const comments = await Comment.paginate({}, {limit : 25, sort : { createAt : -1}, populate : [{
            path : 'user',
            select : 'name'
        } ,
        'course',
        'article'
            
        ]})

        // return res.json(comments)
        res.render('admin/comment/index', { comments });
    }

    comment(req, res, next){

        const addComment = new Comment({
            user : req.user._id,
            ...req.body
        })

        addComment.check = false;
        addComment.save();
        return this.back(req, res);
    }

    async destroy(req, res, next){
        const comment = await Comment.findById(req.params.id).populate([{ path : 'comments'} , { path : 'autoSection'}]).exec();
        if(! comment) return res.json('چنین دیدگاهی در سیستم ثبت نشده است');

        comment.comments.forEach(comment => comment.remove());
        await comment.autoSection.inc('commentCount', -1);
        // return res.json(comment)
        comment.remove();
        return this.back(req, res);
    }

    async update(req, res, next){
        const comment = await Comment.findById(req.params.id).populate('autoSection').exec();
        if(! comment) return res.json('چنین دیدگاهی در سیستم ثبت نشده است');

        comment.check = true;
        await comment.autoSection.inc('commentCount');
        comment.save();
        return this.back(req, res);
    }
}

module.exports = new commentController();