const admin = require('firebase-admin');

exports.getDashboard = (req, res) => {
    res.render('admin/dashboard');
};

exports.getUserManagement = (req, res) => {
    res.render('admin/user_management');
}