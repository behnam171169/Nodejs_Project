const express=require('express');
const router=express.Router();
const upload=require('app/uploadimage');
const fileToField=require('app/http/middleware/fileToField');

router.use((req,res,next)=>{
    res.locals.layout="admin/master"
    next();
})

const courseValidator=require('app/http/validators/courseValidator');
const episodeValidator=require('app/http/validators/episodeValidator');
const adminController=require('app/http/controlers/adminController');
const courseController=require('app/http/controlers/course/courseController');
const episodeController=require('app/http/controlers/episodeController');
router.get('/',adminController.index);
router.get('/course',courseController.index);
router.get('/course/create',courseController.create);
router.post('/course/create',upload.single('images'),fileToField.handle,courseController.store);
router.delete('/course/:id',courseController.destroy);
router.get('/course/:id/edit',courseController.edit);
router.put('/course/:id',upload.single('images'),fileToField.handle,courseController.update);


router.get('/episode', episodeController.index);
router.get('/episode/create', episodeController.create);
router.post('/episode/create', episodeController.store);
// delete episode
router.delete('/episode/:id', episodeController.destroy);
//edit episode
router.get('/episode/:id/edit', episodeController.edit);
router.put('/episode/:id', episodeValidator.handle(), episodeController.update);


module.exports=router;