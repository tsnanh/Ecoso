const admin = require('firebase-admin');

exports.adminAuth = (req, res, next) => {
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(decodeClaims => {
        admin.firestore().collection('users').doc(decodeClaims.uid).get().then(snap => {
            const userData = snap.data();
            if (userData.isAdmin === true) {
                res.locals.uid = decodeClaims.uid;
                res.locals.name = decodeClaims.name;
                next()
            } else {
                res.redirect('/');
            }
        })
    }).catch(() => {
        res.redirect('/login');
    })
};