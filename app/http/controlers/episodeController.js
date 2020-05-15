const controler=require('app/http/controlers/controler');
const course=require('app/models/course');
const Episode=require('app/models/episode');
class courseController extends controler{
async index(req,res,next){
    try{
  
        const episodes=await Episode.find({}).populate('course');
   
        // const Courses=await course.find({});
        res.render('admin/episode/index',{episodes});
    }catch(err){
next(err)
    }
  
}
async  create(req,res,next){
     const Courses=await course.find({});
    res.render('admin/episode/create',{Courses});
}
async edit(req,res,next){
    const episode=await Episode.findById(req.params.id);
    const courses=await course.find({});
   
    res.render('admin/episode/edit',{episode,courses});
}
  store(req,res,next){


    let result=true;
    if(result){
        
        return this.storeProcess(req,res,next);
    }else{
   
        // if(req.file){
           
        //     return this.back(req,res);
        // }
        return this.back(req,res);
    }
}
async update(req,res,next){
    // let result=await this.validationData(req);
    let result=true;
    if(result){
  
       this.updateProcess(req,res,next);
    }else{
        if(req.file){
            this.back(req,res);
        }
    
    }
}

async storeProcess(req,res,next){
try{
    const addepisode=new Episode({...req.body});
 
    await addepisode.save(err => console.log(err));
    
     this.updateCourseTime(req.body.course);
    
    res.redirect('/admin/episode');
}catch(err){
    next(err)
}

}

async updateProcess(req,res,next){
    // await Episode.findByIdAndUpdate(req.params.id,{$set:{...req.body}});
   const  episode=await  Episode.findByIdAndUpdate(req.params.id,{$set:{...req.body}});
  this.updateCourseTime(episode.course);
  this.updateCourseTime(req.body.course);
    return res.redirect('/admin/episode');
}


 async destroy(req,res,next){

    let episode=await Episode.findById(req.params.id);
  
    if(!episode){
       res.json('چنین ویدیویی در این دوره ثبت نشده است')
    }
    this.updateCourseTime(episode.course)
    episode.remove();
    return res.redirect('/admin/episode')
}
async updateCourseTime(courseId){
   
    const Course=await course.findById(courseId).populate('episodes');

    // const episodes=await Episode.find({course:courseId});
    // console.log(this.getTime(episodes),'llklklkl')
    Course.set({time:this.getTime(Course.episodes)});

   
    await Course.save();
   
}
}
module.exports=new courseController();