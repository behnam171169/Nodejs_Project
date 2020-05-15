const controler=require('app/http/controlers/controler');
const Category=require('app/models/category');
const fs=require('fs');

class categoryController extends controler{
async index(req,res,next){

    // let page = req.query.page || 1;
    // const Course = await Course.paginate({}, { page, limit: 10, sort: { createAt: 1 } });

    // this.alert(req, {
    //     type: 'info',
    //     title : 'دوره ها',
    //     text : 'در صفحه مدیریت دوره ها هستید'
    // })

    // res.render('admin/course/index', { Course })
    const categories=await Category.find({}).populate({path:'parent'});

    res.render('admin/category/index',{categories});
}
async create(req,res,next){
    const categories=await Category.find({});
    res.render('admin/category/create',{categories});
}
async edit(req,res,next){
    const category=await Category.findById(req.params.id);
    const categories=await Category.find({parent:null})
    res.render('admin/category/edit',{category,categories});
}
  store(req,res,next){

    // let result=await this.validationData(req);
    let result=true;
    if(result){
        
        return this.storeProcess(req,res,next);
    }else{
   
     
        return this.back(req,res);
    }
}
async update(req,res,next){
    // let result=await this.validationData(req);
    let result=true;
    if(result){
        
        return this.updateProcess(req,res,next);
    }else{
       console.log('امکان ویرایش دسته بندی در حال حاضر وجود ندارد')
        return this.back(req,res);
    }
}

storeProcess(req,res,next){
 
    let {name,parent}=req.body;
const addcategory=new Category({
name,
parent:parent=='none'?null:parent,
slug:this.slug(name)
})
addcategory.save(err => console.log(err));

res.redirect('/admin/category');
}

async updateProcess(req,res,next){
let {name,parent}=req.body;
        await Category.findByIdAndUpdate(req.params.id,{$set:{
            name,
            parent:parent=='none'?null:parent,
            slug:this.slug(name)
        }});
 
  
    return res.redirect('/admin/category');
}
slug(title) {
    return title.replace(/([^۰-۹آ-یa-zA-Z0-9]|-)+/g, '-')
}

 async destroy(req,res,next){

    let category=await Category.findById(req.params.id).populate('childs');

    if(!Course){
       res.json('چنین دسته بندی در سایت ثبت نشده است')
    }
    category.childs.forEach(episode=>episode.remove())
   


    category.remove();
    return res.redirect('/admin/category')
}

}
module.exports=new categoryController();