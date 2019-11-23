const admin = require('firebase-admin');

exports.getAdminPage = (req, res) => {
    const session = req.cookies['session'];
    admin.auth().verifySessionCookie(session, true).then(decodeClaims => {

    })
};