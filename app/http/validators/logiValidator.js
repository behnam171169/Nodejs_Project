const {check}=require('express-validator');
class loginValidation{
    hande(){
        return[
           
            check('email')
            .isEmail()
            .withMessage('فرمت ایمیل معتبر نمی باشد'),
            check('password')
            .isLength({min:8})
            .withMessage('پسوورد نمی تواند کمتر از 8 کاراکتر باشد')
        ]
    }
}
module.exports=new loginValidation();