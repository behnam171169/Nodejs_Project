const express=require('express');
const router=express.Router();
const homeController=require('./../http/controlers/homeController')

router.get('/',homeController.index)
router.get('/logOut',(req,res)=>{
  req.logOut();
  res.clearCookie('remember_token');
  res.redirect('/');
});
  module.exports=router;