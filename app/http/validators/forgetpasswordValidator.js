const {check}=require('express-validator');
class forgetpasswordValidator{
    hande(){
        return[
           
            check('email')
            .isEmail()
            .withMessage('فرمت ایمیل معتبر نمی باشد'),
           
        ]
    }
}
module.exports=new forgetpasswordValidator();