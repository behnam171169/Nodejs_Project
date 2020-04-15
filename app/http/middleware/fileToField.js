const middleware=require('app/http/middleware/middleware');
class fileToField extends middleware{
    handle(req,res,next){
        if(! req.file){
            req.body.images=undefined
        }else{
            req.body.images=req.file.originalname
        }
        next();
    }
}
module.exports=new fileToField();