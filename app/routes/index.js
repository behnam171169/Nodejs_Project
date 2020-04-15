const express=require('express');
const router=express.Router();
const authRouters=require('./auth')
const homeRoutes=require('./home');
const adminRoutes=require('./admin');
const redirectAuthenticated=require('app/http/middleware/redirectAuthenticated');
const redirectAdmin=require('app/http/middleware/redirectAdmin');
router.use('/auth',redirectAuthenticated.handle,authRouters);
router.use('/',homeRoutes);
router.use('/admin',redirectAdmin.handle,adminRoutes);

module.exports=router;