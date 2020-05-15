const Course=require('app/models/course');
const Category=require('app/models/category');
const Comment =require('app/models/comments');
const path=require('path');
const Episode=require('app/models/episode');
const bcrypt = require('bcrypt');
const faker=require('faker');
const Froum=require('app/models/froum');
const FroumQue=require('app/models/froumQue');
const FroumAns=require('app/models/froumAns');
const controller=require('app/http/controlers/controler');
const moment = require('moment-jalaali');
moment.loadPersian({usePersianDigits:true,dialect:'persian-modern'});
class homeController  extends controller{


   async index(req,res){
       const courses=await Course.find({}).populate('user',['name']).populate('episodes').sort({createdAt:1}).limit(6).exec();
   



        res.render('./index',{courses});
    }
    async coursePage(req,res,next){
        const course=await Course.findOneAndUpdate({slug:req.params.course}).populate([
            {
            path:'episodes'
            },
            {
                path:'user',
                select:'name'
            },
         
            {
                path:'comment',
                match:{
                    check:true,
                    parent:null
                },
                populate:[{
                    path:'users',
                    select:'name'
                },{
                    path:'comments',
                    match:{
                        check:true
                    },populate:{
                        path:'users',
                        select:'name'
                    }
                }
            ]
            }
        ]).exec();
        const categories=await  Category.find({parent:null}).populate('childs').exec();

  let time=moment(course.createdAt).format('jD jMMMM jYYYY');
    //    const accessUser=await  this.accessUser(req,course);
//    const accessUser=false;
        res.render('./home/coursePage',{course,time,categories});
    }


    

    // accessUser(req,course){
    //     let access=false;   
    //     if(req.isAuthenticated()){
    //         console.log(course.type,'kkkjjjj')
    //         if(course.type==='vip'){
    //             access=req.user.isVip();
    //         }else if(course.type==='cash'){
    //       access=req.user.payCash();
    //         }else{
    //             access=true;
    //         }
    //     }
    //     return true;
    // }
    async download(req,res,next){
        const episode=await Episode.findById(req.params.id);
        
       if(! episode) return res.json('چنین ویدیویی برای این دوره وجود ندارد')
       if(!this.checkSecretUrl(req,episode)){
           return res.json('لینک دانلود اعتبار لازم را ندارد')
       }
       episode.inc('downloadCount');
       episode.save();
        const filePath=await path.resolve( `./public/${episode.videoUrl}`);
    
        res.download(filePath);
    }
    checkSecretUrl(req, episode){
        const time = new Date().getTime();
        if(req.query.t < time) {
            return res.json('لینک دانلود اعتبار لازم را ندارد')
        }
        const secret = `asdqwoidjopedm!@sdfwe#asd%${episode.id}${req.query.t}`
        return bcrypt.compareSync(secret, req.query.secret);
    }
    async froum(req,res,next){
        try{
            const froums=await Froum.find({}).populate({path:'questions'});
            res.render('home/froum/froum',{froums});
        }catch(err){
next(err)
        }
    }

    async froumQue(req,res,next){
        try{
const Ques=await FroumQue.find({});
res.render('home/froum/froumQue',{Ques})
        }catch(err){
next(err)
        }
    }
    async createfroumQue(req,res,next){
        try{
                   // const froum=await Froum.findById(req.body.froum);
        const addQue=new FroumQue({
            user:req.user.id,
            ...req.body
        })
        await addQue.save();
        res.redirect(`/froumQue/${req.body.froum}`); 
        }catch(err){
            next(err)
        }

    }

    async froumAns(req,res,next){
        try{
            const Que = await FroumQue.findById(req.params.id);
            const Anss=await FroumAns.find({question:req.params.id}).populate({path:'user',select:'name'});
            res.render('home/froum/froumAns',{Anss,Que})
        }catch(err){
next(err)
        }
      
    }
    async createfroumAns(req,res,next){
        const question = await FroumQue.findById(req.body.question);
        try{
            const addAns=new FroumAns({
                user:req.user.id,
    ...req.body       
     })
     const user=await FroumAns.findOne({question:req.body.question}&&{user:req.user.id});
     if(user  !=null){
         await addAns.save();
         question.inc('countAns');
     }else{
        await addAns.save();
       await question.inc('countAns');
      await  question.inc('countUser');
     }
     await addAns.save();
     
     res.redirect(`/froumAns/${req.body.question}`)
        }catch(err){
next(err)
        }

    }
}
module.exports=new homeController();