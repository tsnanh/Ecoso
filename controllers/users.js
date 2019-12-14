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
                res.render('profile', {profile: userData});
            });
        }
    }, err => {
        res.redirect('/login');
    })
};

exports.getPost = (req, res) => {
    const userUID = req.params.uid;
    const postID = req.params.postID;
    admin.firestore().collection('users').doc(userUID).get().then(snap => {
        const user = snap.data();
        admin
            .firestore()
            .collection('users')
            .doc(userUID)
            .collection('posts')
            .doc(postID)
            .get()
            .then(snap => {
                const post = snap.data();
                res.render('post', {post, user});
            });
    })
};