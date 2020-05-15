const express=require('express');
const router=express.Router();
const upload=require('app/uploadimage');
const fileToField=require('app/http/middleware/fileToField');
const commentController=require('app/http/controlers/comment/commentController');
const access=require('app/http/middleware/checkUserAccess');
router.use((req,res,next)=>{
    res.locals.layout="admin/master"
    next();
})
const userController=require('app/http/controlers/user/userController');
const roleController=require('app/http/controlers/role/roleController');
const courseController=require('app/http/controlers/course/courseController');
const episodeValidator=require('app/http/validators/episodeValidator');
const adminController=require('app/http/controlers/adminController');
const categoryController=require('app/http/controlers/category/categoryController');
const profileController=require('app/http/controlers/profile/profileController');
const episodeController=require('app/http/controlers/episodeController');
const permissionController=require('app/http/controlers/permission/permissionController');
const froumController=require('app/http/controlers/froum/froumController');
const chatController=require('app/http/controlers/chat/chatController');
router.get('/',adminController.index);
router.get('/category',categoryController.index);
router.get('/category/create',categoryController.create);
router.post('/category/create',upload.single('images'),fileToField.handle,categoryController.store);
router.delete('/category/:id',categoryController.destroy);
router.get('/category/:id/edit',categoryController.edit);
router.put('/category/:id',upload.single('images'),fileToField.handle,categoryController.update);


router.get('/episode', episodeController.index);
router.get('/episode/create', episodeController.create);
router.post('/episode/create', episodeController.store);
// delete episode
router.delete('/episode/:id', episodeController.destroy);
//edit episode
router.get('/episode/:id/edit', episodeController.edit);
router.put('/episode/:id', episodeController.update);
router.get('/comment',commentController.index);
router.get('/comment/:id',commentController.destroy);
router.put('/comment/:id/approve',commentController.update);


router.get('/', adminController.index);
router.get('/course', courseController.index);
router.get('/course/create', courseController.create);
router.post('/course/create', upload.single('images'), fileToField.handle, courseController.store);
// delete course
router.delete('/course/:id', courseController.destroy);
//edit course
router.get('/course/:id/edit', courseController.edit);
router.put('/course/:id', upload.single('images'), fileToField.handle, courseController.update);



router.get('/category',categoryController.index);
router.get('/category/create',categoryController.create);
router.post('/category/create',categoryController.store);
router.delete('/category/:id',categoryController.destroy);
router.get('/category/:id/edit',categoryController.edit);
router.put('/category/:id',categoryController.update);
router.get('/profile',profileController.index);
router.put('/profile/:id',profileController.updateProfile);



router.get('/permission',permissionController.index);
router.get('/permission/create',permissionController.create);
router.post('/permission/create',upload.single('images'),fileToField.handle,permissionController.store);
router.delete('/permission/:id',permissionController.destroy);
router.get('/permission/:id/edit',permissionController.edit);
router.put('/permission/:id',upload.single('images'),fileToField.handle,permissionController.update);

router.get('/role',roleController.index);
router.get('/role/create',roleController.create);
router.post('/role/create',upload.single('images'),fileToField.handle,roleController.store);
router.delete('/role/:id',roleController.destroy);
router.get('/role/:id/edit',roleController.edit);
router.put('/role/:id',upload.single('images'),fileToField.handle,roleController.update);


router.get('/user',userController.index);
router.get('/user/create',userController.create);
router.post('/user/create',upload.single('images'),fileToField.handle,userController.store);
router.delete('/user/:id',userController.destroy);
router.get('/user/:id/edit',userController.edit);
router.put('/user/:id',userController.update);
router.get('/user/:id/userRoles',userController.userRoles);
// router.put('/user/:id/adduserRoles',userController.adduserRoles);
router.get('/user/:id/adminAccess',userController.adminAccess);
router.post('/course/payment',courseController.payment);
router.get('/chat',chatController.chatForm);
router.get('/chat-room',chatController.chatRoom);


router.get('/', adminController.index);
router.get('/froum', froumController.index);
router.get('/froum/create', froumController.create);
router.post('/froum/create',fileToField.handle, froumController.store);
// delete froum
router.delete('/froum/:id', froumController.destroy);
//edit froum
router.get('/froum/:id/edit', froumController.edit);
router.put('/froum/:id',fileToField.handle, froumController.update);
router.post('/upload-image',upload.single('upload'),adminController.uploadImage)
module.exports=router;