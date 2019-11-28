let express = require('express');
let router = express.Router();
let controller = require('../controllers/admin');
const middleware = require('../middleware/admin_authentication')

router.get('/', middleware.adminAuth, controller.getDashboard);
router.get('/dashboard', middleware.adminAuth, controller.getDashboard)
router.get('/usermanagement', middleware.adminAuth, controller.getUserManagement);

module.exports = router;