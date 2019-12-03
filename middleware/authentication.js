const admin = require('firebase-admin');
exports.auth = (req, res, next) => {
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(decodeClaims => {
        admin.firestore().collection('users').doc(decodeClaims.uid).get().then(snap => {
            if (snap.exists) {
                res.locals.avatar = snap.get('avatar');
                res.locals.uid = decodeClaims.uid;
                res.locals.name = decodeClaims.name;
                res.locals.permission = snap.get('isAdmin');
                next()
            } else {
                res.redirect('/updateInfo');
            }
        });
    }).catch(err => {
        res.redirect('/login');
    })
};