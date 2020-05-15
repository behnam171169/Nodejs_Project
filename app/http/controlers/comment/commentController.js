const controller=require('app/http/controlers/controler');
const Comment=require('app/models/comments');
class commentController extends controller{
    async index(req,res,next){
        const comments=await Comment.find({}).populate([{
            path:'users',
            select:'name'
        },
    {
        path:'courses'
    },
    {
        path:'article'
    }
    ])
       res.render('admin/comment/index',{comments})
    }
  comment(req,res,next){
        const addcomment=new Comment({
            user:req.user.id,
            ...req.body
        })
        addcomment.check=false;
        addcomment.save();
   
        return this.back(req,res);
    }
    async destroy(req,res,next){
        const comment=await Comment.findById(req.params.id).populate([{path:'comments'},{path:'autoSection'}]).exec();
        // await comment.autoSection.inc('commentCount',-1);
        if(! comment) return res.json('چنین دیدگاهی در سیستم ثبت نشده است');
        comment.comments.forEach(comment=>comment.remove());
   
        comment.remove();
        return this.back(req,res);
    }
    async update(req,res,next){
        const comment=await Comment.findById(req.params.id).populate('autoSection').exec();
        if(! comment) return res.json('چنین دیدگاهی در سیسنم ثبت نشده است');
        comment.check=true;
        // comment.autoSection.inc('commentCount');
        comment.save();
        return this.back(req,res);
    }
}
module.exports=new commentController();