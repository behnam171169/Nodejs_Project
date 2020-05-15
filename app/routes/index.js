const express=require('express');
const router=express.Router();
const authRouters=require('./auth')
const homeRoutes=require('./home');
const adminRoutes=require('./admin');
const redirectAuthenticated=require('app/http/middleware/redirectAuthenticated');
const redirectifNotAuthenticated =require('app/http/middleware/redirectifNotAuthenticated');
const redirectAdmin=require('app/http/middleware/redirectAdmin');
const checkError=require('app/http/middleware/checkError');
router.use('/auth',redirectAuthenticated.handle,authRouters);
router.use('/',homeRoutes);
router.use('/admin',redirectifNotAuthenticated.handle,adminRoutes);

// redirectAdmin.handle
router.all('*',checkError.get404);
// router.use(checkError.handle);
module.exports=router;