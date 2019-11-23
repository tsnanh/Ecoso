const admin = require('firebase-admin');

exports.profile = function (req, res) {
    const uid = req.params.uid;
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(decodeClaims => {
        if (uid === decodeClaims.uid) {
            res.redirect('/profile');
        } else {
            admin.firestore().collection('users').doc(uid).get().then(snap => {
                const userData = snap.data();
                res.render('profile', userData);
            });
        }
    }, err => {
        res.redirect('/login');
    })
};