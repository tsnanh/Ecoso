const admin = require('firebase-admin');

exports.profile = function (req, res) {
    const uid = req.params.uid;
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(decodeClaims => {
        if (uid === decodeClaims.uid) {
            res.redirect('/profile');
        } else {
            res.render('profile', {uid: uid});
        }
    }, err => {
        res.redirect('/login');
    })
};