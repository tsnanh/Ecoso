let express = require('express');
let router = express.Router();
let controller = require('../controllers/admin');
const middleware = require('../middleware/admin_authentication');

router.get('/', middleware.adminAuth, controller.getDashboard);
router.get('/dashboard', middleware.adminAuth, controller.getDashboard);
router.get('/userManagement', middleware.adminAuth, controller.getUserManagement);
router.post('/removeUser', middleware.adminAuth, controller.removeUser);
router.get('/userLocation', middleware.adminAuth, controller.getUsersLocation);
router.get('/postManagement', middleware.adminAuth, controller.getPostManagement);
router.post('/removePost', middleware.adminAuth, controller.removePost);

module.exports = router;