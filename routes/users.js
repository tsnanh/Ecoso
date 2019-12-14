var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');
const middleware = require('../middleware/authentication');

/* GET users listing. */
router.get('/:uid', middleware.auth, controller.profile);
router.get('/:uid/posts/:postID', middleware.auth, controller.getPost);

module.exports = router;
