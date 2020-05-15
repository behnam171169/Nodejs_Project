const express=require('express');
const router=express.Router();
const all=require('./all');

router.use('/api',all);
module.exports=router;