const path = window.location.pathname;
const arr = path.substring(1, path.length).split('/');
const postID = arr[3];
const userID = arr[1];


$(window).bind('load', () => {

    firebase
        .firestore()
        .collection('users')
        .doc(userID).collection('posts').onSnapshot(snap => {
            snap.docChanges().forEach(doc => {
                if (doc.type === 'added') {

                }
                if (doc.type === 'modified') {
                    $('#content').text(doc.doc.data().content);
                    $('#likeCount').html('<i class="fa fa-gittip"></i>  ' + doc.doc.data().likes.count + '<a class="float-right" onclick="commentPost(\'' + doc.doc.data().id + '\',\'' + doc.doc.data().user + '\')"><i class="fa fa-comment"></i>&nbsp;' + doc.doc.data().comments.count + '</a>');
                }
                if (doc.type === 'removed') {

                }
            })
    })
    firebase
        .firestore()
        .collection('users')
        .doc(userID)
        .collection('posts')
        .doc(postID)
        .collection('userComment')
        .orderBy('timePosted', 'asc')
        .onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                const doc = change.doc;
                if (change.type === 'added') {
                    // TODO: display comments
                    $('.commentContainer').prepend('<div class="comment mb-4" style="background: #0d4b19; border-radius: 8px;" id="' + doc.data().id + '">\n' +
                        '<div class="d-flex p-2">\n' +
                        '<img style="width: 80px;height: 80px;background: white;" src="' + doc.data().avatar + '" class="rounded-circle" />\n' +
                        '<div class="postContentInside ml-2">\n' +
                        '<a href="/users/' + doc.data().uid + '">' + doc.data().name + '</a>\n' +
                        '<span class="ml-2" style="font-size: 12px;">' + doc.data().time + '</span>\n' +
                        '<p style="color: white">' + doc.data().content + '</p>\n' +
                        '</div>\n' +
                        '</div>\n' +
                        '</div>');
                }
                if (change.type === 'modified') {
                    $('#' + doc.data().id + '>div>div>p').text(doc.data().content);
                    $('#' + doc.data().id + '>div>div>span').text(doc.data().time);

                }
                if (change.type === 'removed') {
                    $('#' + doc.data().id).remove();
                }

            })
    })
});

function likePost() {
    $.ajax({
        method: 'POST',
        url: '/likePost',
        data: {postID: postID, userID: userID}
    });
}

function commentPost() {
    if (document.getElementById('commentText').value === '') {
        alert('Content must not be empty!');
    } else {
        $.ajax({
            method: 'POST',
            url: '/commentPost',
            data: {
                postID,
                userID
            }
        });
    }
}

function comment() {
    const txt = document.getElementById('commentText');
    $.ajax({
        url: '/comment',
        method: 'POST',
        data: {
            postID: postID,
            userID: userID,
            content: txt.value
        }
    }).done(() => {
        txt.value = '';
    })
}

$('#editButton').click(() => {
    $('#modalEdit').modal('toggle');
});

$('#deleteButton').click(() => {
    $('#modalDelete').modal('toggle');
});

function updatePost(postID) {
    if (!$('#postContent').val()) {
        $('#warn').text('Content must not be null!');
    } else {
        $.ajax({
            url: '/editPost',
            method: 'POST',
            data: {
                content: $('#postContent').val(),
                postID: postID
            },
            success: () => {
                $('#modalEdit').modal('toggle');
            }
        });
    }
}

function deletePost(postID) {
        $.ajax({
            url: '/deletePost',
            method: 'POST',
            data: {
                postID: postID
            },
            success: () => {
                window.open('/', '_self');
            }
        });
}