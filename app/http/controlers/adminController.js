const controller=require('app/http/controlers/controler');
class adminController extends controller{
    index(req,res,next){
        res.render('admin/index')
    }
}
module.exports=new adminController();