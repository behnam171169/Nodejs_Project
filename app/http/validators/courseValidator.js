const {check}=require('express-validator');
const path = require('path');
class courseValidator{
    handle(){
        return[
            check('title')
            .isLength({min:15})
            .withMessage('نام نمیتواند کمتر از 6 کاراکتر باشد'),
            check('body')
            .not().isEmpty()
            .withMessage('متن دوره نمیتواند خالی باشد'),
            check('type')
            .not().isEmpty()
            .withMessage('نوع دوره را وارد کنید'),
            check('images')
            .custom((value,{req}) =>{
                if(req.query._method==='PUT' && value===undefined) return;
                if(requestAnimationFrame.qu)
                if(! value){
                    throw new Error('تصویر دوره را وارد  کنید')
                }else{
                    const fileExe=['.png','.jpg','.jepg','.svg']
                    if(!fileExe.includes( path.extname(value)) !== '.png'){
                        throw new Error('فایل انتخابی تصویر نمی باشد')
                    }
                }
                
            })
            .not().isEmpty()
            .withMessage('تصویر دوره را وارد کنید'),
            check('price')
            .not().isEmpty()
            .withMessage('هزینه دوره را وارد کنید'),
            check('tags')
            .not().isEmpty()
            .withMessage('تگ های دوره را وارد کنید')
       
       
        ]
    }
}
module.exports=new courseValidator();