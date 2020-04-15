const controler=require('app/http/controlers/controler');
const course=require('app/models/course');
const fs=require('fs');
const sharp = require('sharp');
const User = require('app/models/users');
const path=require('path');
class courseController extends controler{
async index(req,res,next){
    const Course=await course.find({});
    // console.log(courses,'ddddd')
    res.render('admin/course/index',{Course});
}
async create(req,res,next){
    const courses=await course.find({});
    res.render('admin/course/create',{courses});
}
async edit(req,res,next){
    const Course=await course.findById(req.params.id);
    res.render('admin/course/edit',{Course});
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
 
  let images=req.body.images;


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
//  let imageUrl={};
    if(req.file){
        req.body.images=req.file.images
    }else{
        delete req.body.images
        await course.findByIdAndUpdate(req.params.id,{$set:{...req.body}});
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

    let Course=await course.findById(req.params.id);

    if(!Course){
       res.json('چنین دوره ای در سایت ثبت نشده است')
    }
     Object.values(Course.images).forEach(image=>fs.unlinkSync(`./public${image}`));


    Course.remove();
    return res.redirect('/admin/course')
}


// resizeImage(image){
//     const imagePath = path.parse(image.path);
//         let imageUrl = {};
//         imageUrl['original'] = this.getDirImage(`${image.destination}/${image.filename}`);

//         let resize = size => {
//             const imageName = `${imagePath.name}-${size}${imagePath.ext}`;
//             imageUrl[size] = this.getDirImage(`${image.destination}/${imageName}`);

//             sharp(image.path)
//                 .resize(size, null)
//                 .toFile(`${image.destination}/${imageName}`)
//         }

//         [1080, 720, 480, 360].map(resize);

//         return imageUrl;
// }
}
module.exports=new courseController();