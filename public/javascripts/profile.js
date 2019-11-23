function likeYourPost(postID, userID) {
    document.getElementById("like").style.pointerEvents = 'none';
    $.ajax({
        method: 'POST',
        url: '/likePost',
        data: {postID: postID, userID: userID}
    }).done(() => {
        document.getElementById("like").style.pointerEvents = 'auto';
    });
}

function commentYourPost(postID, userID) {
    window.open('/user/' + userID + '/post/' + postID, '_self');
}

$(window).bind("load", () => {
    const path = window.location.pathname;

    function getId() {
        const arr = document.getElementById('userID').textContent.split(' ');
        return arr[1];
    }

    if (path === '/profile') {
        document.getElementById('titlePosts').innerHTML = "Your Posts";
        loadPosts(getId());
    } else {
        const uid = path.substring(1, path.length).split('/')[1];
        loadPosts(uid);
    }

    function loadPosts(uid) {
        firebase.firestore().collection('users').doc(uid).collection('posts').orderBy('timePosted', 'desc').onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const post = change.doc.data();
                    const time = getDateDiff(post.timePosted);
                    firebase.firestore().collection('users').doc(post.user).get().then(snap => {
                        const poster = snap.data();
                        $('#postContainer').append('<div class="post" id="' + post.id + '">' +
                            '<img class="mx-auto d-block" src="' + post.image + '" />' +
                            '<div class="postContent d-flex">' +
                            '<img class="rounded-circle" src="' + poster.avatar + '" />' +
                            '<div class="postContentInside ml-3">' +
                            '<a href="/users/' + post.user + '">' + poster.name + '</a>' +
                            '<span class="ml-2">' + time + '</span>' +
                            '<p>' + post.content + '</p>' +
                            '</div>' +
                            '</div>' +
                            '<div id="' + post.id + 'likeCount" class="ml-2" style="color: darkgreen"><i class="fa fa-gittip"></i>  ' + post.likes.count + '</div>' +
                            '<div class="row text-center p-2 mb-2">' +
                            '<div class="col-6"><a id="like" style="color:darkgreen;cursor: pointer" onclick="likeYourPost(\'' + post.id + '\',\'' + post.user + '\')" class="card-link"><i class="fa fa-gittip"></i>  Like</a></div>\n' +
                            '<div class="col-6"><a style="color:darkgreen;cursor: pointer" onclick="commentYourPost(\'' + post.id + ',' + post.user + '\')" class="card-link"><i class="fa fa-comment"></i>  Comment</a></div>\n' +
                            '</div>' +
                            '</div>');
                    })
                } else if (change.type === 'modified') {
                    const post = change.doc.data();
                    $('#' + post.id + 'likeCount').html('<i class="fa fa-gittip"></i>  ' + post.likes.count);
                }
            })
        })

    }

});