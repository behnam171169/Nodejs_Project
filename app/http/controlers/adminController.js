const controller=require('app/http/controlers/controler');
const User=require('app/models/users');
class adminController extends controller{
   async index(req,res,next){
        const user=await User.findById(req.user._id);
       
        res.render('admin/index')
    }
    uploadImage(req, res, next) {
        let image = req.file;
        console.log(image);
        res.json({
            "uploaded" : 1,
            "fileName" : image.originalname,
            "url" : `${image.destination}/${image.filename}`.substring(8)
        })
    }
}
module.exports=new adminController();