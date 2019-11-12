var express = require('express');
var router = express.Router();
let controller = require('../controllers/index');
let firebaseMiddleware = require('express-firebase-middleware');

const admin = require('firebase-admin');

router.use('/auth', firebaseMiddleware.auth);

/* GET home page. */
router.get('/', controller.get_index);
router.get('/login', controller.get_login);
router.post('/login', controller.login);
router.post('/signOut', controller.signOut);
router.get('/updateInfo', controller.getUpdateInfo);
router.post('/updateInfo', controller.updateUserInfo);
router.post('/createPost', controller.createNewPost);
router.get('/profile', controller.getProfile);

module.exports = router;
