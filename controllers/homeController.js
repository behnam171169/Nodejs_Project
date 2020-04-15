const controller = require('./controller');
const Course = require('app/models/course');
const Category = require('app/models/category');
const Article = require('app/models/article');
const Episode = require('app/models/episode');
const Froum = require('app/models/froum');
const FroumQue = require('app/models/froumQue');
const FroumAns = require('app/models/froumAns');
const path = require('path');
const bcrypt = require('bcrypt');

const moment = require('moment-jalaali');
moment.loadPersian({usePersianDigits : true , dialect : 'persian-modern'});

class homeController extends controller {
    async index(req, res) {
        const courses = await Course.find({}).sort({ createdAt: 1 }).limit(3).exec();
        const articles = await Article.find({}).sort({ createdAt: 1 }).limit(3).exec();
        res.render('index', { courses, articles });
    }

    async coursePage(req, res, next) {
        const course = await Course.findOneAndUpdate({ slug: req.params.course }, { $inc : { viewCount : 1 }}).populate([{
            path : 'user',
            select : 'name'
        } , {
            path : 'episodes'
        }, {
            path : 'comments',
            match : {
                check : true,
                parent : null
            },
            populate : [{
                path : 'user',
                select : 'name'
            }, {
                path : 'comments',
                match : {
                    check : true
                },populate : {
                    path : 'user',
                    select : 'name'
                }
            }]
        },

    
    ]).exec();

        const categories = await Category.find({parent : null}).populate('childs').exec();
        // return res.json(categories);

    
        res.render('home/page/coursePage', { course, categories});
    }

    async articlePage(req, res, next) {
        const article = await Article.findOneAndUpdate({ slug: req.params.article }, { $inc : { viewCount : 1 }}).populate([{
            path : 'user',
            select : 'name'
        } , {
            path : 'comments',
            match : {
                check : true,
                parent : null
            },
            populate : [{
                path : 'user',
                select : 'name'
            }, {
                path : 'comments',
                match : {
                    check : true
                },populate : {
                    path : 'user',
                    select : 'name'
                }
            }]
        },

    
    ]).exec();

        const categories = await Category.find({parent : null}).populate('childs').exec();
        res.render('home/page/articlePage', { article, categories });
    }


    async download(req, res){
        const episode = await Episode.findById(req.params.id);
        if(! episode) return res.json('چنین ویدیویی برای این دوره وجود ندارد');
        if(! this.checkSecretUrl(req, episode)){
            return res.json('لینک دانلود اعتبار لازم را ندارد')
        }

        episode.inc('downloadCount');

        const filePath = await path.resolve(`./public/${episode.videoUrl}`);
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

    async froum(req, res, next) {
        try {
            const froums = await Froum.paginate({}, {limit : 10, sort : { createdAt : 1}, populate : { path : 'questions'}});
            res.render('home/page/froum/froum' , { froums });
        } catch (err) {
            next(err)
        }
    }

    async froumQue(req, res, next) {
        try {
            const Ques = await FroumQue.paginate({}, { limit : 10, sort : { createdAt : 1 }});
            res.render('home/page/froum/froumQue', { Ques });
        } catch (err) {
            next(err)
        }
    }

    async froumAns(req, res, next) {
        const Que = await FroumQue.findById(req.params.id);
        const Anss = await FroumAns.paginate({ question : req.params.id }, { limit : 10 , sort : { createdAt : 1}, populate : { path : 'user' , selcet : 'name'}});
        res.render('home/page/froum/froumAns', { Anss, Que });
    }

    async createfroumQue(req, res, next) {
       try {
        const froum = await Froum.findById(req.body.froum);
        const addQue = new FroumQue({
            user : req.user.id,
            ...req.body
        })

        await addQue.save();
        
        this.alert(req, {
            title : "ثبت اطلاعات",
            text : `سوال شما در انجمن ${froum.title}`,
            type : "success"
        })

        res.redirect(`/froumQue/${req.body.froum}`);
       } catch (err) {
           next(err)
       }
    }

    async createfroumAns(req, res, next) {
        try {
            const question = await FroumQue.findById(req.body.question);

            const addAns = new FroumAns({
                user : req.user.id,
                ...req.body
            })
    
            const user = await FroumAns.findOne({ question : req.body.question,user : req.user.id });
            if(user != null) {
                await addAns.save();
                question.inc('countAns');  
            } else {
                await addAns.save();
                await question.inc('countAns');  
                await question.inc('countUser'); 
            }
            
            this.alert(req, {
                title : 'ثبت اطلاعات',
                text : `پاسخ شما برای سوال ${question.title} ثبت شد`,
                type : 'success'
            })

            res.redirect(`/froumAns/${req.body.question}`)
        } catch (err) {
            next(err)
        }
        
    }
}

module.exports = new homeController();