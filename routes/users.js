var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');
const middleware = require('../middleware/authentication');

/* GET users listing. */
router.get('/:uid', middleware.auth, controller.profile);

module.exports = router;
