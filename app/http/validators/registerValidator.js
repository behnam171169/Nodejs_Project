const {check}=require('express-validator');
class registerValidation{
    hande(){
        return[
            check('name')
            .isLength({min:6})
            .withMessage('نام نمیتواند کمتر از 6 کاراکتر باشد'),
            check('email')
            .isEmail()
            .withMessage('فرمت ایمیل معتبر نمی باشد'),
            check('password')
            .isLength({min:8})
            .withMessage('پسوورد نمی تواند کمتر از 8 کاراکتر باشد')
        ]
    }
}
module.exports=new registerValidation();