$(document).ready(function () {

    let image;
    let input = document.getElementById('profilePhoto');
    input.addEventListener('change', function (event) {
        image = event.target.files[0];
    });

    $('#updateInfo').click(function () {
        let uid = firebase.auth().currentUser.uid;
        console.log(image);
        if (image) {
            const userFolder = firebase.storage().ref(uid).child('avatars').child(image.name);
            userFolder.put(image).then(snap => {
                snap.ref.getDownloadURL().then(url => {
                    sendInformationData(url);
                })
            });
        } else {
            sendInformationData('/images/avatar-icon.png')
        }
    });

    function sendInformationData(url) {
        let data = {
            avatar: url,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value
        };
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/updateInfo', false);
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
        xmlHttpRequest.send(JSON.stringify(data));
    }
});