const admin = require('firebase-admin');

exports.likePost = (req, res) => {
        const postRef = admin.firestore().collection('users').doc(req.body.userID).collection('posts').doc(req.body.postID);
        postRef.get().then(async snap => {
            let like = await snap.data().likes.count;
            const userRef = await postRef.collection('userLiked').doc(res.locals.uid);
            await userRef.get().then(async snap => {
                if (!snap.exists) {
                    await userRef.set({uid: res.locals.uid, name: res.locals.name}).then();
                    await postRef.update({
                        likes: {
                            count: like + 1,
                        }
                    }).then();
                } else {
                    await postRef.update({
                        likes: {
                            count: like - 1,
                        }
                    }).then();
                    await userRef.delete().then();
                }
            });
            await res.send();
        });
};

exports.get_index = function(req, res) {
    const uid = res.locals.uid;
    const sessionCookie = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(sessionCookie, true).then(decodeClaims => {
        admin.firestore().collection('users').doc(uid).get().then(snap => {
            if (snap.exists) {
                res.render('home_page');
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
        admin.auth().verifySessionCookie(session, true).then(() => {
            res.redirect('/');
        }).catch(() => {
            res.render('index');
        });
    } else {
        res.render('index');
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
        console.log(error);
        res.status(401).send('Unauthorized request!' + error);
    })
};

exports.signOut = function (req, res) {
    res.clearCookie('session');
    res.send();
};

exports.getUpdateInfo = function (req, res) {
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(decodeClaims => {
        admin.firestore().collection('users').doc(decodeClaims.uid).get().then(snap => {
            if (snap.exists) {
                res.redirect('/');
            } else {
                res.render('update_user_info');
            }
        });
    })
};

exports.updateUserInfo = function (req, res) {
    const session = req.cookies['session'] || '';
    admin.auth().verifySessionCookie(session, true).then(async decodeClaims => {
        const avatar = await req.body.avatar;
        const dateOfBirth = req.body.dateOfBirth;
        const phoneNumber = req.body.phoneNumber;
        const address = req.body.address;
        const gender = req.body.gender;
        const userData = {
            id: decodeClaims.uid,
            name: decodeClaims.name,
            avatar: avatar,
            dateOfBirth: dateOfBirth,
            phoneNumber: phoneNumber,
            address: address,
            timeJoined: new Date().getTime(),
            isAdmin: false,
            tree: 0,
            postCount: 0,
            gender: gender
        };
        const userRef = await admin.firestore().collection('users').doc(decodeClaims.uid);
        await userRef.set(userData).then(() => {
            res.redirect('/');
        });
    }).catch(err => {
        console.log(err);
        res.redirect('/login')
    })
};

function getTime() {
    const date = new Date();
    let HH = date.getHours();
    let MM = date.getMinutes();
    let ss = date.getSeconds();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    return dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + MM + ':' + ss;
}

exports.createNewPost = (req, res) => {
        const uid = res.locals.uid;

        const ref = admin.firestore().collection('users').doc(uid).collection('posts').doc();
        admin.firestore().collection('users').doc(uid).get().then(snap => {
            const avatar = snap.data().avatar;
            const dataPost = {
                id: ref.id,
                user: uid,
                userDisplayName: res.locals.name,
                content: req.body.content,
                image: req.body.image,
                likes: {
                    count: 0
                },
                comments: {
                    count: 0
                },
                timePosted: new Date().getTime(),
                time: getTime(),
                userAvatar: avatar
            };
            ref.set(dataPost).then(() => {
                res.send();
            });
        })
};

exports.getProfile = function (req, res) {
    admin.firestore().collection('users').doc(res.locals.uid).get().then(snap => {
        if (snap.exists) {
            res.render('profile', {profile: snap.data()});
        } else {
            res.render('error');
        }
    });
};

exports.comment = (req, res) => {
    const userID = req.body.userID;
    const postID = req.body.postID;
    const content = req.body.content;
        admin.firestore().collection('users').doc(res.locals.uid).get().then(snap => {
            const avatar = snap.data().avatar;
            const time = getTime();
            const postRef = admin
                .firestore()
                .collection('users')
                .doc(userID)
                .collection('posts')
                .doc(postID);
            postRef.get().then(snap => {
                postRef.update('comments', {count: snap.data().comments.count + 1});
            });
            postRef.collection('userComment')
                .doc()
                .set({
                    avatar: avatar,
                    content: content,
                    name: res.locals.name,
                    time: time,
                    timePosted: new Date().getTime(),
                    uid: res.locals.uid
                }).then(() => {
                res.send();
            });

        })
};

exports.getGlobalChat = (req, res) => {
    res.render('global_chat');
};

exports.deletePost = (req, res) => {
    admin.firestore().collection('users').doc(req.body.userID).collection('posts').doc(req.body.postID).delete().then(() => {
        res.send();
    });
};

exports.getAboutPage = (req, res) => {
    res.render('about');
};

exports.sendMessage = (req, res) => {
    const message = req.body.content;

    const ref = admin
        .firestore()
        .collection('globalChat')
        .doc();

    ref.set({
        message: message,
        id: ref.id,
        user: res.locals.uid,
        userAvatar: res.locals.avatar,
        userDisplayName: res.locals.name,
        timeStamp: new Date().getTime(),
        timeSent: getTime(),
    }).then(() => {
        res.send();
    })
};

exports.editPost = (req, res) => {
    admin
        .firestore()
        .collection('users')
        .doc(res.locals.uid)
        .collection('posts')
        .doc(req.body.postID)
        .update({
            content: req.body.content
        }).then(() => {
            res.send();
    });
};

exports.deletePost = (req, res) => {
    admin
        .firestore()
        .collection('users')
        .doc(res.locals.uid)
        .collection('posts')
        .doc(req.body.postID)
        .delete().then(() => {
        res.send();
    });
};

exports.updateLocation = (req, res) => {
    const userRef = admin.firestore().collection('users').doc(res.locals.uid);
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    userRef.update('latitude', latitude);
    userRef.update('longitude', longitude);

    res.send();
};