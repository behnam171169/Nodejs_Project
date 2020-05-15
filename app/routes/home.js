const express=require('express');
const router=express.Router();
const homeController=require('./../http/controlers/homeController');
const commentController=require('app/http/controlers/comment/commentController');
const courseController=require('app/http/controlers/course/courseController');
router.get('/course/:course',homeController.coursePage);
router.get('/download/:id',homeController.download);
router.post('/course/payment',courseController.payment);
router.post('/comment',commentController.comment);
router.get('/',homeController.index)
router.get('/courses',courseController.allCourse);
router.get('/course/payment/callbackurl',courseController.callbackurl);
router.get('/froum',homeController.froum);
router.get('/froumQue/:id',homeController.froumQue);
router.get('/froumAns/:id',homeController.froumAns);
router.post('/froumQue/',homeController.createfroumQue);
router.post('/froumAns/',homeController.createfroumAns);


router.get('/logOut',(req,res)=>{
  req.logOut();
  res.clearCookie('remember_token');
  res.redirect('/');
  
});
  module.exports=router;