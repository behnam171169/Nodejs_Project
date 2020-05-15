const middleware=require('app/http/middleware/middlewares');
class checkError extends middleware{
    async get404(req,res,next){
        try{
            this.error('kh',404);
            // throw new Error('چنین صفحه ای وجود ندارد')
        }catch(err){
            next(err)
        }
    }
    async handle(err,req,res,next){
        const statusCode=err.status||500;
        const message =err.message|| '';
        const stack=err.stack || '';
      if(config.debug) return res.render('error/stack',{statusCode,message,stack})
      return res.render(`error/${statusCode}`,{message})
    }
    error(message,status){
        let err = new Error(message);
        err.status=status;
        throw err;
    }
}
module.exports=new checkError();