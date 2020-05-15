const express = require('express');
const router = express.Router();
const all=require('./v1/all');
router.use('/api/v1',all);
module.exports=router;