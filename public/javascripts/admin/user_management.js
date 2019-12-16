const firestore = firebase.firestore();

const userContainer = $('#userContainer');

let lastVisible = null;

function appendData(data) {
    userContainer.append('<tr id="' + data.id + '">' +
        '<td class="name"><a href="/users/' + data.id + '">' + data.name + '</a></td>' +
        '<td class="dateOfBirth">' + data.dateOfBirth + '</td>' +
        '<td class="phoneNumber">' + data.phoneNumber + '</td>' +
        '<td class="dateJoined">' + getDateTime(data.timeJoined) + '</td>' +
        '<td class="address">' + data.address + '</td>' +
        '<td class="postCount">' + data.postCount + '</td>' +
        '<td class="font-weight-bold treeCount">' + data.tree + '</td>' +
        '<td><a onclick="removeUser(\'' + data.id + '\')" href="javascript:void(0)" class="btn btn-success">Remove</a></td>' +
        '</tr>')
}

function removeUser(uid) {
    $.ajax({
        method: 'POST',
        data: { uid },
        url: '/admin/removeUser',
    }).done(() => {
        window.open('/admin/userManagement', '_self');
    })
}

function getUserList() {
    firestore
        .collectionGroup('users')
        .orderBy('name', 'asc')
        .limit(20)
        .onSnapshot(snap => {
            lastVisible = snap.docs[snap.docs.length - 1];
        snap.docChanges().forEach(change => {
            if (change.type === 'added') {
                const data = change.doc.data();
                appendData(data)
            }
            if (change.type === 'modified') {
                const data = change.doc.data();
                $('#' + data.id + '>.postCount').text(data.postCount);
                $('#' + data.id + '>.treeCount').text(data.tree);
                $('#' + data.id + '>.dateOfBirth').text(data.dateOfBirth);
                $('#' + data.id + '>.phoneNumber').text(data.phoneNumber);
                $('#' + data.id + '>.address').text(data.address);
            }
            if (change.type === 'remove') {
                const data = change.doc.data();
                $('#' + data.id).remove();
            }
        })
    })
}

function getDateTime(timestamp) {
    let date = new Date(timestamp);
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();

    return dd + '/' + mm + '/' + yyyy;
}

$(document).ready(() => {
    getUserList()
});

async function lazyLoad() {
    const scrollIsAtTheBottom = (document.documentElement.scrollHeight - window.innerHeight) === window.scrollY;
    if (scrollIsAtTheBottom) {
        if (lastVisible) {
            firestore.collection('users').orderBy('name', 'asc').startAfter(lastVisible).onSnapshot(snap => {
                lastVisible = snap.docs[snap.docs.length - 1];
                snap.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        appendData(change.doc.data())
                    }
                    if (change.type === 'modified') {
                        const data = change.doc.data();
                        $('#' + data.id + '>.postCount').text(data.postCount);
                        $('#' + data.id + '>.treeCount').text(data.tree);
                        $('#' + data.id + '>.dateOfBirth').text(data.dateOfBirth);
                        $('#' + data.id + '>.phoneNumber').text(data.phoneNumber);
                        $('#' + data.id + '>.address').text(data.address);
                    }
                    if (change.type === 'remove') {
                        const data = change.doc.data();
                        $('#' + data.id).remove();
                    }
                })
            })
        }
    }
}

window.addEventListener('scroll', lazyLoad);