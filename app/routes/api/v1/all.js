const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
const courseController=require('app/http/controlers/api/v1/courseController');
const userController=require('app/http/controlers/api/v1/userController');
router.get('/jwt',courseController.createToken);
router.get('/jwt/:token',courseController.verifyToken);
router.get('/login',userController.login)
module.exports=router;