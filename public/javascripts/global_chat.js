const uid = document.getElementById('userID').value;
let lastVisible = null;
$(document).ready(() => {
    firebase
        .firestore()
        .collection('globalChat')
        .orderBy('timeStamp', 'asc')
        .limit(100)
        .onSnapshot(querySnap => {
            lastVisible = querySnap.docs[querySnap.docs.length - 1];
            querySnap.docChanges().forEach(change => {
                if (change.type === 'added') {
                    appendMessage(change.doc.data());
                }
            });
        });
    setTimeout(() => {
        messageContainer.scrollTop(messageContainer[0].scrollHeight);
    }, 3000);
});
const messageContainer = $('#messageContainer');

function sendMessage() {
    const txtMessage = document.getElementById('txtMessage')
    const message = txtMessage.value;
    if (message === '') return;
    $.ajax({
        method: 'POST',
        url: '/sendMessage',
        data: {
            content: message
        }
    }).done(() => {
        txtMessage.value = '';
    })
}

function appendMessage(message) {
    if (message.user === uid) {
        let direction = 'end';
        messageContainer.append('<div class="d-flex justify-content-' + direction + ' mb-5">' +
            '<div class="msg_container_send">' +
            '<a style="text-decoration: none; color: darkgreen; font-weight: bold;" href="/users/' + message.user + '">' + message.userDisplayName + '</a><br/>' +
            message.message +
            '</div>' +
            '<div class="img_cont_msg">' +
            '<img src="' + message.userAvatar + '" class="rounded-circle user_img_msg">' +
            '</div>' +
            '</div>');
    } else {
        let direction = 'start';
        messageContainer.append('<div class="d-flex justify-content-' + direction + ' mb-5">' +
            '<div class="img_cont_msg">' +
            '<img src="' + message.userAvatar + '" class="rounded-circle user_img_msg">' +
            '</div>' +
            '<div class="msg_container">' +
            '<a style="text-decoration: none; color: darkgreen; font-weight: bold;" href="/users/' + message.user + '">' + message.userDisplayName + '</a><br/>' +
            '' + message.message +
            '</div>' +
            '</div>');
    }
    messageContainer.scrollTop(messageContainer[0].scrollHeight);
}