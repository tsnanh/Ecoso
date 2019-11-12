var express = require('express');
var router = express.Router();
const controller = require('../controllers/users');

/* GET users listing. */
router.get('/:uid', controller.profile);

module.exports = router;
