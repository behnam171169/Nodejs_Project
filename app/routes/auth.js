const express=require('express');
const passport=require('passport');
const forgetPasswordController=require('app/http/controlers/forgetPasswordController');
const resetPasswordController=require('app/http/controlers/resetPasswordController');
const router=express.Router();
const registervalidator=require('./../http/validators/registerValidator');
const  forgetpasswordValidator=require('./../http/validators/forgetpasswordValidator');
const  resetpasswordValidator=require('./../http/validators/resetpasswordValidator');
const loginvalidator=require('./../http/validators/logiValidator');
const registerConteroller=require('./../http/controlers/registerController')
const loginController=require('./../http/controlers/loginController')
router.get('/register',registerConteroller.showForm);
router.post('/register',registervalidator.hande(),registerConteroller.registerProcess);
router.get('/login',loginController.showForm);
router.post('/login',loginvalidator.hande(),loginController.loginProcess);
// router.get('/google',passport.authenticate('google',{scope:['email','profile']}));
// router.get('/google/callback',passport.authenticate('google',{successRedierct:'/',failureRedirect:'/auth/login'}));
router.get('/password/reset',forgetPasswordController.showForm);
router.post('/password/email', forgetpasswordValidator.hande(),forgetPasswordController.resetLinkProcess);
router.get('/password/reset/:token',resetPasswordController.showForm);
router.post('/password/reset',resetpasswordValidator.hande(),resetPasswordController.resetPasswordProcess);
module.exports=router;