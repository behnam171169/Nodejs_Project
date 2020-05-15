const controller=require('app/http/controlers/controler');
const Course=require('app/models/course');
const jwt=require('jsonwebtoken');
class courseController extends controller{
    async createToken(req,res,next){
        const token=await jwt.sign({id:'123456'},"secertkey",{expiresIn:60})
        res.json({
            data:token,
            status:'success'
        })
    }
    async verifyToken(req,res,next){
        const decode=jwt.verify(req.params.token,"secertkey")
        res.json({
            data:decode,
            status:'success'
        })
    }
}
module.exports=new courseController();