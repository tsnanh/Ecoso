const inputImage = document.getElementById('imagePost');
const imagePreview = document.getElementById('imgPreview');
const firestore = firebase.firestore();
let image;
let lastVisible = null;
let quill;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('#reverse').addClass('flex-column-reverse');
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            $.ajax({
                url: '/updateLocation',
                method: 'PUT',
                data: {
                    latitude: latitude,
                    longitude: longitude
                }
            });
        });
    }
}

$(document).ready(() => {
    getLocation();
     quill = new Quill(
        '#taPost', {
            theme: 'bubble',
            placeholder: 'What\'s on your mind?'
        }
    )
});

function quillGetHTML(inputDelta) {
    var tempCont = document.createElement("div");
    (new Quill(tempCont)).setContents(inputDelta);
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}

$("#dropBtn").click(function(){
    console.log('cac');
    $('#dropdown').css('display', 'block');
}, function(){
    // change to any color that was previously used.
    $('#dropdown').css('display', 'none');
});

inputImage.addEventListener('change', event => {
    image = event.target.files[0];
    imagePreview.src = window.URL.createObjectURL(image);
});

$('#btnPost').click(function() {
    const content = quill.getText(0, quill.getLength());
    console.log(content.length);
    if (content.trim().length === 0) {
        document.getElementById('warningText').innerHTML = 'Content must not empty!';
        document.getElementById('warning').style.display = 'block';
        quill.setText('');
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
    let content = quillGetHTML(quill.getContents());
    let dataPost = {
        user: uid,
        content: content,
        image: url,
        timePosted: time
    };
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/createPost', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(dataPost));
    inputImage.src = '';
    imagePreview.src = '';
    quill.setText('');
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

function handleActivitySubscription(snapshot, counter) {
    const initialLoad = counter === 1;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    snapshot.docChanges().forEach(async (change) => {
        if (initialLoad) {
            await appendPost(change.doc.data());
            console.log(change.doc.data());
        } else {
            if (change.type === 'added') {
                const post = change.doc.data();
                prependPost(post);
            }
            if (change.type === 'modified') {
                console.log('edit');
                const post = change.doc.data();
                $('#' + post.id + '>div>div>.contentPost').html(post.content);
                $('#' + post.id + 'likeCount').html('<i class="fa fa-gittip"></i>  ' + post.likes.count + '<a style="cursor: pointer" class="float-right" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a>');
            }
        }
    });
}

const handleActivitySubscriptionWithCounter =
    createFnCounter(handleActivitySubscription, 0);


function createFnCounter(fn, invokeBeforeExecution) {
    let count = 0;
    return (args) => {
        count++;
        if (count <= invokeBeforeExecution) {
            return true;
        } else {
            return fn(args, count);
        }
    };
}


let doc = firestore.collectionGroup('posts').orderBy('timePosted', 'desc').limit(20);
doc.onSnapshot(handleActivitySubscriptionWithCounter);

// load more post when user scroll to bottom hihihihihihihi
$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() === $(document).height()) {
        console.log(lastVisible);
        if (lastVisible) {
            let next = firestore.collectionGroup("posts").orderBy("timePosted", 'desc').startAfter(lastVisible).limit(20);
            next.onSnapshot(querySnap => {
                lastVisible = querySnap.docs[querySnap.docs.length - 1];
                querySnap.docChanges().forEach(async change => {
                    if (change.type === 'added') {
                        await appendPost(change.doc.data())
                        console.log(change.doc.data())
                    }
                    if (change.type === 'modified') {
                        console.log('edit');
                        const post = change.doc.data();
                        $('#' + post.id + '>div>div>.contentPost').text(post.content);
                        $('#' + post.id + 'likeCount').html('<i class="fa fa-gittip"></i>  ' + post.likes.count + '<a style="text-decoration: none;color:darkgreen; cursor: pointer;" class="float-right" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a>');
                    }
                    if (change.type === 'removed') {
                        console.log('remove');
                        const remove = change.doc.data();
                        $('html').find('#' + remove.id).remove();
                    }
                })
            })
        }
    }
});

function prependPost(post) {
    const time = getDateDiff(post.timePosted);
        $('#postContainer').prepend('<div class="post" id="' + post.id + '">' +
            '<a href="' + post.image + '"><img class="mx-auto d-block" style="border-radius: 8px;" src="' + post.image + '"  alt="" /></a>' +
            '<div class="postContent d-flex">' +
            '<img class="rounded-circle" src="' + post.userAvatar + '"  alt=""/>' +
            '<div class="postContentInside ml-3">' +
            '<a href="/users/' + post.user + '">' + post.userDisplayName + '</a>' +
            '<span class="ml-2">' + time + '</span>' +
            '<div class="contentPost">' + post.content + '</div>' +
            '</div>' +
            '</div>' +
            '<div id="' + post.id + 'likeCount" class="ml-2 mr-2" style="color: darkgreen"><i class="fa fa-gittip"></i>  ' + post.likes.count + '<a style="text-decoration: none;color:darkgreen; cursor: pointer;" class="float-right" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a></div>' +
            '<div class="row text-center p-2 mb-2">' +
            '<div class="col-6"><a id="like" style="color:darkgreen;cursor: pointer" onclick="likePost(\'' + post.id + '\',\'' + post.user + '\')" class="card-link"><i class="fa fa-gittip"></i>  Like</a></div>\n' +
            '<div class="col-6"><a style="color:darkgreen;cursor: pointer" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')" class="card-link"><i class="fa fa-comment"></i>  Comment</a></div>\n' +
            '</div>' +
            '</div>');
}

async function appendPost(post) {
    const time = await getDateDiff(post.timePosted);
        $('#postContainer').append('<div style="margin-bottom: 24px; margin-top: 24px" class="post" id="' + post.id + '">' +
            '<a href="' + post.image + '"><img class="mx-auto d-block" style="border-radius: 8px;" src="' + post.image + '" /></a>' +
            '<div class="postContent d-flex">' +
            '<img class="rounded-circle" src="' + post.userAvatar + '" />' +
            '<div class="postContentInside ml-3">' +
            '<a href="/users/' + post.user + '">' + post.userDisplayName + '</a>' +
            '<span class="ml-2">' + time + '</span>' +
            '<div class="contentPost">' + post.content + '</div>' +
            '</div>' +
            '</div>' +
            '<div id="' + post.id + 'likeCount" class="ml-2 mr-2" style="color: darkgreen;"><i class="fa fa-gittip"></i>  ' + post.likes.count + '<a style="cursor: pointer" class="float-right" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a></div>' +
            '<div class="row text-center p-2 mb-2">' +
            '<div class="col-6"><a id="like" style="color:darkgreen;cursor: pointer" onclick="likePost(\'' + post.id + '\',\'' + post.user + '\')" class="card-link"><i class="fa fa-gittip"></i>  Like</a></div>\n' +
            '<div class="col-6"><a style="color:darkgreen;cursor: pointer" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')" class="card-link"><i class="fa fa-comment"></i>  Comment</a></div>\n' +
            '</div>' +
            '</div>');
}

function likePost(postID, userID) {
    document.getElementById("like").style.pointerEvents = 'none';
    $.ajax({
        method: 'POST',
        url: '/likePost',
        data: {postID: postID, userID: userID},
    }).done(() => {
        document.getElementById("like").style.pointerEvents = 'auto';
    });
}

function commentPost(postID, userID) {
    window.open('/users/' + userID + '/posts/' + postID, '_self');
}

// start running after page loaded
$(window).bind('load', () => {
    // observer user's tree count
    setTimeout(() => {
        let elements = document.getElementsByTagName('h1');
        let uid = elements[0].getAttribute('id');
        firestore.collection('users').doc(uid).onSnapshot(snap => {
            $('#yourTree').text(snap.data().tree)
        });
    }, 5000);

    firestore.collectionGroup('users').onSnapshot(snap => {
        let tree = 0
        snap.forEach(doc => {
            tree += doc.data().tree
        })
        $('#totalTree').text(tree);
    })
});
