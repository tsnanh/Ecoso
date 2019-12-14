const express = require('express');
const router = express.Router();
const middleware = require('../middleware/authentication');
const controller = require('../controllers/index');

/**
 *  TODO: DO NOT TOUCH WHAT YOU HAVE DONE!
**/
router.get('/', middleware.auth, controller.get_index);
router.get('/login', controller.get_login);
router.post('/login', controller.login);
router.get('/signOut', middleware.auth, controller.signOut);
router.get('/updateInfo', controller.getUpdateInfo);
router.post('/updateInfo', controller.updateUserInfo);
router.post('/createPost', middleware.auth, controller.createNewPost);
router.get('/profile', middleware.auth, controller.getProfile);
router.post('/likePost', middleware.auth, controller.likePost);
router.post('/comment', middleware.auth, controller.comment);
router.get('/globalChat', middleware.auth, controller.getGlobalChat);
router.post('/deletePost', middleware.auth, controller.deletePost);
router.get('/about', middleware.auth, controller.getAboutPage);
router.post('/sendMessage', middleware.auth, controller.sendMessage);
router.post('/editPost', middleware.auth, controller.editPost);
router.post('/deletePost', middleware.auth, controller.deletePost);
router.put('/updateLocation', middleware.auth, controller.updateLocation);

module.exports = router;
