const firestore = firebase.firestore();

// const tfSearch = document.getElementById('searchUser')

const userContainer = $('#postContainer');

let lastVisible = null;
/**
 * Khong su dung duoc search, firestore chua ho tro
 */
// tfSearch.addEventListener('input', (event) => {
//     userContainer.empty();
//     if (this.value === '') {
//         firestore.collectionGroup('users').where('name', '===', this.value).get().then(snap => {
//             snap.forEach(doc => {
//                 const data = doc.data()
//                 appendData(data)
//             })
//         })
//     } else {
//         getUserList()
//     }
// })

async function appendData(post) {
    await userContainer.append('<div style="margin-bottom: 24px; margin-top: 24px" class="post" id="' + post.id + '">' +
        '<a href="' + post.image + '"><img class="mx-auto d-block" src="' + post.image + '" /></a>' +
        '<div class="postContent d-flex card-header-success">' +
        '<img class="rounded-circle" src="' + post.userAvatar + '"  alt=""/>' +
        '<div class="postContentInside ml-3">' +
        '<a href="/users/' + post.user + '">' + post.userDisplayName + '</a>' +
        '<span class="ml-2">' + post.time + '</span>' +
        '<p>' + post.content + '</p>' +
        '</div>' +
        '</div>' +
        '<div id="' + post.id + 'likeCount" class="ml-2 mr-2" style="color: lightgreen"><i class="fa fa-gittip"></i>  ' + post.likes.count + '<a class="float-right" onclick="commentPost()"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a></div>' +
        '<div class="row text-center p-2 mb-2">' +
        '<div class="col-6"><a style="color: lightgreen" href="/user/' + post.user + '/post/' + post.id + '" class="card-link"><i class="material-icons">visibility</i>  View</a></div>' +
        '<div class="col-6"><a style="color: lightgreen" href="javascript:void(0)" onclick="removePost(\'' + post.user + '\', \'' + post.id + '\')" class="card-link"><i class="material-icons">delete</i>  Delete</a></div>' +
        '</div>' +
        '</div>');
}

function handleActivitySubscription(snapshot, counter) {
    const initialLoad = counter === 1;
    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    snapshot.docChanges().forEach(async function(change) {
        if (initialLoad) {
            await appendData(change.doc.data());
        } else {
            if (change.type === 'added') {
                // const post = change.doc.data();
                // prependData(post);
            }
            if (change.type === 'modified') {
                console.log('edit');
                const post = change.doc.data();
                $('#' + post.id + 'likeCount').html('<i class="fa fa-gittip"></i>  ' + post.likes.count + '<a style="cursor: pointer" class="float-right" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a>');
                $('#' + post.id + '>.postContent>.postContentInside>p').html(post.content);
            }
            if (change.type === 'removed') {
                $('html').find('#' + change.doc.data().id).remove();
                // const remove = change.doc.data();
                // $('#' + remove.id).remove();
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

function getPostList() {
    let doc = firestore.collectionGroup('posts').orderBy('timePosted', 'desc').limit(20);
    doc.onSnapshot(handleActivitySubscriptionWithCounter);
}

// load more post when user scroll to bottom hihihihihihihi
$(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() === $(document).height()) {
        console.log(lastVisible);
        if (lastVisible) {
            let next = firestore.collectionGroup("posts").orderBy("timePosted", 'desc').startAfter(lastVisible).limit(20);
            next.onSnapshot(querySnap => {
                lastVisible = querySnap.docs[querySnap.docs.length - 1];
                querySnap.docChanges().forEach(async change => {
                    if (change.type === 'modified') {
                        console.log('edit');
                        const post = change.doc.data();
                        $('#' + post.id + 'likeCount').html('<i class="fa fa-gittip"></i>  ' + post.likes.count + '<a style="cursor: pointer" class="float-right" onclick="commentPost(\'' + post.id + '\',\'' + post.user + '\')"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a>');
                        $('#' + post.id + '>.postContentInside>p').html(post.content);
                    }
                })
            })
        }
    }
});

/** todo: WAITING FOR SOLUTIONS **/
// function prependData(post) {
//     console.log('booom');
//     userContainer.prepend('<div class="post" id="' + post.id + '">' +
//         '<img class="mx-auto d-block" src="' + post.image + '" />' +
//         '<div class="postContent d-flex card-header-success">' +
//         '<img class="rounded-circle" src="' + post.userAvatar + '" />' +
//         '<div class="postContentInside ml-3">' +
//         '<a href="/users/' + post.user + '">' + post.userDisplayName + '</a>' +
//         '<span class="ml-2">' + post.time + '</span>' +
//         '<p>' + post.content + '</p>' +
//         '</div>' +
//         '</div>' +
//         '<div id="' + post.id + 'likeCount" class="ml-2 mr-2" style="color: lightgreen"><i class="fa fa-gittip"></i>  ' + post.likes.count + '<a class="float-right" onclick="commentPost()"><i class="fa fa-comment"></i>&nbsp;' + post.comments.count + '</a></div>' +
//         '<div class="row text-center p-2 mb-2">' +
//         '<div class="col-6"><a style="color: lightgreen" href="/user/' + post.user + '/post/' + post.id + '" onclick="viewPost()" class="card-link"><i class="material-icons">visibility</i>  View</a></div>' +
//         '<div class="col-6"><a style="color: lightgreen" href="javascript:void(0)" onclick="removePost(\'' + post.user + '\', \'' + post.id + '\')" class="card-link"><i class="material-icons">delete</i>  Delete</a></div>' +
//         '</div>' +
//         '</div>');
// }


function removePost(uid, id) {
    console.log(uid + '  ' + id);
    $.ajax({
        method: 'POST',
        data: { uid: uid, id: id },
        url: '/admin/removePost',
    }).done(() => {
        window.open('/admin/postManagement', '_self');
    })
}
/* UNUSED */
// function getDateTime(timestamp) {
//     let date = new Date(timestamp)
//     let dd = String(date.getDate()).padStart(2, '0');
//     let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
//     let yyyy = date.getFullYear();
//
//     return dd + '/' + mm + '/' + yyyy;
// }

$(document).ready(() => {
    getPostList()
});

async function lazyLoad() {
    const scrollIsAtTheBottom = (document.documentElement.scrollHeight - window.innerHeight) === window.scrollY;
    if (scrollIsAtTheBottom) {
        if (lastVisible) {
            firestore.collectionGroup('posts').orderBy('timePosted', 'desc').startAfter(lastVisible).onSnapshot(snap => {
                lastVisible = snap.docs[snap.docs.length - 1];
                snap.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        appendData(change.doc.data())
                    }
                    if (change.type === 'modified') {
                        const data = change.doc.data();
                        $('#' + data.id + '>.postContentInside>p').html(data.content);
                    }
                })
            })
        }
    }
}

window.addEventListener('scroll', lazyLoad);