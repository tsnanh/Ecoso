const firestore = firebase.firestore();

$(document).ready(() => {
    getNumberOfMessage();
    getTotalPost();
    getNewUser();
    getNumberOfTreePlantedAndTotalUser();
    getTopFiveUser();
    getUserGrowMostTree();
    getLikeAndCommentCount();
});

function getUserGrowMostTree() {
    firestore
        .collectionGroup('users')
        .orderBy('tree', 'desc')
        .limit(1)
        .onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                const user = change.doc.data();
                if (user.tree === 0) {
                    $('#userPlantMostTree').html('Unknown');
                } else {
                    $('#userPlantMostTree').html('<a href="/users/' + user.id + '">' + user.name + '</a>');
                }
            })
        })
}

function getLikeAndCommentCount() {
    firestore
        .collectionGroup('posts')
        .onSnapshot(snap => {
            let likeCount = 0;
            let commentCount = 0;
            snap.forEach(doc => {
                const post = doc.data();
                likeCount += post.likes.count;
                commentCount += post.comments.count;
            });
            $('#likeCount').text(likeCount);
            $('#commentCount').text(commentCount);
        })
}

function getTotalPost() {
    firestore.collectionGroup('posts').onSnapshot(snap => {
        $('#totalPost').text(snap.docs.length)
    })
}

function isNewUser(timeStamp) {
    const currentDate = new Date().getDate();
    const dateUserJoined = new Date(timeStamp).getDate();
    return currentDate === dateUserJoined;
}

function getNewUser() {
    firestore.collectionGroup('users').onSnapshot(snap => {
        let users = 0;
        snap.forEach(doc => {
            const user = doc.data();
            const timeStamp = user.timeJoined;
            if (isNewUser(timeStamp)) {
                users++
            }
        });
        $('#newUserOfDay').text(users)
    })
}

function getNumberOfTreePlantedAndTotalUser() {
    firestore.collectionGroup('users').onSnapshot(snapshot => {
        let tree = 0;
        snapshot.forEach(change => {
            tree += change.data().tree
        });
        $('#totalTreePlanted').text(tree);
        $('#totalUser').text(snapshot.docs.length)
    })
}

function getNumberOfMessage() {
    firestore.collection('globalChat').onSnapshot(snap => {
        $('#numberOfMessage').text(snap.docs.length)
    })
}

function getTopFiveUser() {
    firestore.collectionGroup('users').orderBy('tree', 'desc').limit(5).onSnapshot(snap => {
        const topFiveContainer = $('#topFiveUser');
        snap.docChanges().forEach(change => {
            if (change.type === 'added') {
                const data = change.doc.data();
                topFiveContainer.append('<tr id="' + data.id + '"><td class="name">' + data.name + '</td><td class="postCount">' + data.postCount + '</td><td class="font-weight-bold treeCount">' + data.tree + '</td></tr>')
            }
            if (change.type === 'modified') {
                const data = change.doc.data();
                $('#' + data.id + '>.postCount').text(data.postCount);
                $('#' + data.id + '>.treeCount').text(data.tree);
            }
            if (change.type === 'remove') {
                const data = change.doc.data();
                $('#' + data.id).remove();
            }
        })
    })
}