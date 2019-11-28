const firestore = firebase.firestore()

function getUserList() {
    firestore
        .collectionGroup('users')
        .orderBy('name', 'asc')
        .limit(20)
        .onSnapshot(snap => {
        const userContainer = $('#userContainer');
        snap.docChanges().forEach(change => {
            if (change.type === 'added') {
                const data = change.doc.data()
                userContainer.append('<tr id="' + data.id + '">' +
                    '<td class="name">' + data.name + '</td>' +
                    '<td class="dateOfBirth">' + data.dateOfBirth + '</td>' +
                    '<td class="phoneNumber">' + data.phoneNumber + '</td>' +
                    '<td class="timeJoined">' + data.timeJoined + '</td>' +
                    '<td class="address">' + data.address + '</td>' +
                    '<td class="postCount">' + data.postCount + '</td>' +
                    '<td class="font-weight-bold treeCount">' + data.tree + '</td>' +
                    '</tr>')
            }
            if (change.type === 'modified') {
                const data = change.doc.data();
                $('#' + data.id + '>.postCount').text(data.postCount);
                $('#' + data.id + '>.treeCount').text(data.tree);
            }
            if (change.type === 'remove') {
                const data = change.doc.data()
                $('#' + data.id).remove();
            }
        })
    })
}

$(document).ready(() => {
    getUserList()
})

$(window).scroll(() => {

})