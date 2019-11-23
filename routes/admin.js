let express = require('express');
let router = express.Router();
let controller = require('../controllers/admin');

router.get('/', controller.getAdminPage);

module.exports = router;