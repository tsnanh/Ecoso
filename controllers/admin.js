const admin = require('firebase-admin');
// const firestore = admin.firestore();

exports.getDashboard = (req, res) => {
    res.render('admin/dashboard');
};

exports.getUserManagement = (req, res) => {
    res.render('admin/user_management');
};

exports.removeUser = (req, res) => {
    const uid = req.body.uid;
    admin.firestore().collection('users').doc(uid).delete().then(() => {
        res.send()
    });
};

exports.getUsersLocation = (req, res) => {
    res.render('admin/users_location')
};

exports.getPostManagement = (req, res) => {
    res.render('admin/post_management');
};

exports.removePost = (req, res) => {
    const uid = req.body.uid;
    const id = req.body.id;
    console.log(uid + '  ' + id);
    admin.firestore().collection('users').doc(req.body.uid).collection('posts').doc(req.body.id).delete();
    res.send()
};