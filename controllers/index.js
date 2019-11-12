const admin = require('firebase-admin');

exports.get_index = function(req, res) {
    // TODO: ask teacher about 'secure:true' cookie...
    const sessionCookie = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(sessionCookie, true).then(decodeClaims => {
        const uid = decodeClaims.uid;
        admin.firestore().collection('users').doc(uid).get().then(snap => {
            if (snap.exists) {
                const avatar = snap.get('avatar');
                res.render('home_page', {
                    avatar: avatar,
                    user: decodeClaims.name
                });
            } else {
                res.redirect('/updateInfo');
            }
        });
    }).catch( () => {
        res.render('index');
    })
};

exports.get_login = function (req, res)
{
    const session = req.cookies['session'] || '';
    if (req.cookies['session']) {
        admin.auth().verifySessionCookie(session, true).then(decodeClaims => {
            res.redirect('/');
        }).catch(() => {
            res.render('login');
        });
    } else {
        res.render('login');
    }
};

exports.login = function (req, res) {
    // Redirect user to homepage
    const auth = req.header('Authorization');
    const token = auth.split(' ');
    let expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin.auth().createSessionCookie(token[1], {expiresIn}).then((sessionCookie) => {
        const options = {maxAge: expiresIn, httpOnly: false, secure: false};
        res.cookie('session', sessionCookie, options);
        res.end()
    }, error => {
        res.status(401).send('Unauthorized request!' + error);
    })
};

exports.signOut = function (req, res) {
    res.clearCookie('session');
    res.send();
};

exports.getUpdateInfo = function (req, res) {
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(decodeIdToken => {
        const uid = decodeIdToken.uid;
        admin.firestore().collection('users').doc(uid).get().then(snap => {
            if (snap.exists) {
                res.redirect('/');
            } else {
                res.render('update_user_info');
            }
        });
    }, error => {
        res.redirect('/login');
    });
};

exports.updateUserInfo = function (req, res) {
    admin.auth().verifySessionCookie(req.cookies['session'], true).then(decodeIdToken => {
        const avatar = req.body.avatar;
        const dateOfBirth = req.body.dateOfBirth;
        const phoneNumber = req.body.phoneNumber;
        const address = req.body.address;
        const userData = {
            name: decodeIdToken.name,
            avatar: avatar,
            dateOfBirth: dateOfBirth,
            phoneNumber: phoneNumber,
            address: address
        };
        console.log(userData);
        admin.firestore().collection('users').doc(decodeIdToken.uid).set(userData).then( () => {
            res.redirect('/');
        });
    }).catch(err => {
        res.redirect('/login');
    })
};

exports.createNewPost = (req, res) => {
    const sessionCookie = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(sessionCookie, true).then(decodeClaims => {
        const uid = decodeClaims.uid;
        const time = req.body.timePosted;
        const dataPost = {
            user: uid,
            userDisplayName: decodeClaims.name,
            content: req.body.content,
            image: req.body.image,
            likes: {
                count: 0
            },
            comments: {
                count: 0
            },
            timePosted: new Date().getTime()
        };
        admin.firestore().collection('users').doc(uid)
            .collection('posts').doc().set(dataPost).then(() => {
                res.send();
        });
    });
};

exports.getProfile = function (req, res) {
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(decodeClaims => {

    });
    res.render('profile');
};