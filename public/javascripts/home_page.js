const inputImage = document.getElementById('imagePost');
const taContentPost = document.getElementById('taPost');
const imagePreview = document.getElementById('imgPreview');
const firestore = firebase.firestore();
let image;

inputImage.addEventListener('change', event => {
    image = event.target.files[0];
    imagePreview.src = window.URL.createObjectURL(image);
});

$('#btnPost').click(function() {
    if (taContentPost.value === '') {
        document.getElementById('warningText').innerHTML = 'Content must not empty!';
        document.getElementById('warning').style.display = 'block';
        return;
    } else {
        document.getElementById('warning').style.display = 'none';
    }
    let uid = firebase.auth().currentUser.uid;
    const time = getCurrentTimeString();
    if (image) {
        const imagePath = firebase.storage().ref(uid).child('posts').child(time +
            '.' + image.name.split('.').pop());
        imagePath.put(image).then(snap => {
            snap.ref.getDownloadURL().then(url => {
                sendPost(uid, url, time);
            });
        });
    } else {
        sendPost(uid, '', time);
    }
});

function sendPost(uid, url, time) {
    let dataPost = {
        user: uid,
        content: taContentPost.value,
        image: url,
        timePosted: time
    };
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/createPost', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(dataPost));
    inputImage.src = '';
    imagePreview.src = '';
    taContentPost.value = '';
}

function getCurrentTimeString() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let MM = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let hh = String(today.getHours()).padStart(2, '0');
    let mm = String(today.getMinutes()).padStart(2, '0');
    let ss = String(today.getSeconds()).padStart(2, '0');
    return yyyy + MM + dd + hh + mm + ss;
}

// database.ref('posts').once('value', snap => {
//     const list = snap.val();
//     for (let key in list) {
//         if (!list.hasOwnProperty(key)) {
//             continue;
//         }
//         let object = list[key];
//         showPost(object);
//     }
// });


// firestore.collectionGroup('posts').get().then(querySnap => {
//     querySnap.forEach(doc => {
//
//     })
// });


function getDateDiff(timePosted) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timePost = new Date(timePosted);
    const day = days[timePost.getDay()];
    return day + ' ' + timePost.getDate() + '/' + (timePost.getMonth() + 1) + '/' + timePost.getFullYear();
}


firebase.auth().onAuthStateChanged(user => {

});

let doc = firestore.collectionGroup('posts').orderBy('timePosted', 'asc').limit(50);
let observer = doc.onSnapshot(querySnap => {
    querySnap.docChanges().forEach(change => {
        if (change.type === 'added') {
            console.log('add');
            const object = change.doc.data();
            const time = getDateDiff(object.timePosted);
            console.log(object);
            firebase.firestore().collection('users').doc(object.user).get().then(snap => {
                const poster = snap.data();
                if (object.image) {
                    $('#postContainer').prepend('<div class="post" id="' + object.id + '">' +
                        '<img class="mx-auto d-block" src="' + object.image + '" />' +
                        '<div class="postContent d-flex">' +
                        '<img class="rounded-circle" src="' + poster.avatar + '" />' +
                        '<div class="postContentInside ml-3">' +
                        '<a href="/users/' + object.user + '">' + poster.name + '</a>' +
                        '<span class="ml-2">' + time + '</span>' +
                        '<p>' + object['content'] + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                } else {
                    $('#postContainer').prepend('<div class="post" id="' + object.key + '">' +
                        '<div class="postContent d-flex">' +
                        '<img class="rounded-circle" src="' + poster.avatar + '" />' +
                        '<div class="postContentInside ml-3">' +
                        '<a href="/users/' + object.user + '">' + poster.name + '</a>' +
                        '<span class="ml-2">' + time + '</span>' +
                        '<p>' + object['content'] + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                }
            });
        }
        if (change.type === 'modified') {
            console.log('edit');
        }
        if (change.type === 'removed') {
            console.log('remove');

        }
    })
});