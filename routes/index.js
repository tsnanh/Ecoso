const express = require('express');
const router = express.Router();
const middleware = require('../middleware/authentication');
const controller = require('../controllers/index');

/* GET home page. */
router.get('/', middleware.auth, controller.get_index);
router.get('/login', controller.get_login);
router.post('/login', controller.login);
router.post('/signOut', middleware.auth, controller.signOut);
router.get('/updateInfo', controller.getUpdateInfo);
router.post('/updateInfo', controller.updateUserInfo);
router.post('/createPost', middleware.auth, controller.createNewPost);
router.get('/profile', middleware.auth, controller.getProfile);
router.post('/likePost', middleware.auth, controller.likePost);
router.get('/user/:uid/post/:postID', middleware.auth, controller.getPost);
router.post('/comment', middleware.auth, controller.comment);
router.get('/globalChat', middleware.auth, controller.getGlobalChat);

module.exports = router;
