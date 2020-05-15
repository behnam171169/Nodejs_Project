const controler=require('app/http/controlers/controler');
const course=require('app/models/course');
const Category=require('app/models/category');
const Payment=require('app/models/payment');
const fs=require('fs');
const sharp = require('sharp');
const User = require('app/models/users');
const path=require('path');
var request = require('request-promise');

class courseController extends controler{
async index(req,res,next){

    // let page = req.query.page || 1;
    // const Course = await Course.paginate({}, { page, limit: 10, sort: { createAt: 1 } });

    // this.alert(req, {
    //     type: 'info',
    //     title : 'دوره ها',
    //     text : 'در صفحه مدیریت دوره ها هستید'
    // })

    // res.render('admin/course/index', { Course })
    const Course=await course.find({});

    res.render('admin/course/index',{Course});
}
async create(req,res,next){
    // const courses=await course.find({});
    const categories=await Category.find({});
    res.render('admin/course/create',{categories});
}
async edit(req,res,next){
    const categories=await Category.find({});
    const Course=await course.findById(req.params.id);
    res.render('admin/course/edit',{Course,categories});
}
  store(req,res,next){

    // let result=await this.validationData(req);
    let result=true;
    if(result){
        
        return this.storeProcess(req,res,next);
    }else{
   
        if(req.file){
            fs.unlink(req.file.path,(err)=>{console.log(err)})
            return this.back(req,res);
        }
        return this.back(req,res);
    }
}
async update(req,res,next){
    // let result=await this.validationData(req);
    let result=true;
    if(result){
        
        return this.updateProcess(req,res,next);
    }else{
        if(req.file){
            fs.unlinkSync(req.file.path)
          
        }
        return this.back(req,res);
    }
}

storeProcess(req,res,next){
 
  let images=this.resizeImage(req.file);


    let {title,body,type,price,tags}=req.body;
const addcourse=new course({
user:req.user._id,
title,
slug:this.slug(title),
images,
body,
type,
price,
tags
})
addcourse.save(err => console.log(err));

res.redirect('/admin/course');
}

async updateProcess(req,res,next){
 let imageUrl={};
    if(req.file){
        imageUrl.images=req.file.images
    }else{
        delete req.body.images
        await course.findByIdAndUpdate(req.params.id,{$set:{...req.body,...imageUrl}});
    }
  
    return res.redirect('/admin/course');
}
slug(title) {
    return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, '-')
}
getDirImage(dir){
return dir.substring(8)
}
 async destroy(req,res,next){

    let Course=await course.findById(req.params.id).populate('episodes');

    if(!Course){
       res.json('چنین دوره ای در سایت ثبت نشده است')
    }
    Course.episodes.forEach(episode=>episode.remove())
    Object.values(Course.images).forEach(image=>fs.unlinkSync(`./public${image}`));


    Course.remove();
    return res.redirect('/admin/course')
}


resizeImage(image){
    const imagePath = path.parse(image.path);
        let imageUrl = {};
        imageUrl['original'] = this.getDirImage(`${image.destination}/${image.filename}`);

        let resize = size => {
            const imageName = `${imagePath.name}-${size}${imagePath.ext}`;
            imageUrl[size] = this.getDirImage(`${image.destination}/${imageName}`);

            sharp(image.path)
                .resize(size, null)
                .toFile(`${image.destination}/${imageName}`)
        }

        [1080, 720, 480, 360].map(resize);

        return imageUrl;
}
async allCourse(req,res,next){
    let query={};
    if(req.query.search)
    query.title=new RegExp(req.query.search, 'gi');
    if(req.query.type && req.query.type != 'all')
    query.type=req.query.type;
    if(req.query.category && req.query.category != 'all'){
  let category=await Category.findOne({slug:req.query.category})
        if(category){
            query.categories={$in:[category.id]}
        }
    }
const categories=await Category.find({});
console.log(categories,'fdfdfdf')
    const courses=await course.find({...query}).sort({createdAt:1});

    res.render('home/auth/courses',{courses,categories})
}
async payment(req, res, next) {
    const Course = await course.findById(req.body.courses);
   
    if (!Course) {
        res.json('چنین دوره ای وجود ندارد');
    }

    if (req.user.checkpayCash(Course._id)) {
        res.json('این دوره شما قبلا خریداری نموده اید')
    }

    if (Course.price == 0 && (Course.type == 'vip' ||Course.type == 'free')) {
        res.json('خریداری این دوره امکان پذیر نیست')
    }


    let params = {
        MerchantID: '97221328-b053-11e7-bfb0-005056a205be',
        Amount:100,
        CallbackURL: 'http://localhost:5000/course/payment/callbackurl',
        Description: `حرید دوره ${Course.title}`,
        Email: req.user.email,
    }
//     console.log(params,'dddddd')
// let options={
//     method:'POST',
//     url:'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
//     header:{
//         'cache-controler':'no-cache',
//         'content-type':'application/json'
//     },
//     body:params,
//     json:true
// }
    let options = this.getOptions('https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json', params);

    request(options)
        .then(async data => {
        //  res.json(data)
            const addPayinfo = new Payment({
                user: req.user.id,
                course: course.id,
                resnumber: data.Authority,
                price: Course.price
            })

            await addPayinfo.save();
            res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`);
        })
        .catch(err => res.json(err.message));

}
async callbackurl(req, res, next) {
    const payment = await Payment.findOne({ resnumber: req.query.Authority }).populate('course').exec();
    if (!payment.course) {
        res.json('not course')
    }

    if (req.query.Status && req.query.Status != 'OK') {
        res.json('not ok')
    }

    let params = {
        MerchantID: '97221328-b053-11e7-bfb0-005056a205be',
        Authority: req.query.Authority,
        Amount: payment.course.price,
    }

    let options = this.getOptions('https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json', params);

    request(options)
        .then(async data =>{
            if(data.Status == 100){
                payment.set({ payment : true});
                await User.updateOne({'_id' : req.user.id} , { $set : { payCash : payment.course.id }});
                await payment.save();

                res.redirect(payment.course.path());
            }else {
                res.json('payment not execute')
            }
        })
        .catch(err => res.json(err.message))


}
getOptions(url, params) {
    return {
        method: 'POST',
        url: url,
        header: {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
        },
        body: params,
        json : true
    }
}
}
module.exports=new courseController();