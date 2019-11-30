$(document).ready(function () {
    let image;
    let input = document.getElementById('profilePhoto');

    let latitude = 0;
    let longitude = 0;

    input.addEventListener('change', function (event) {
        image = event.target.files[0];
    });

    getLocation()
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                console.log(latitude)
            });
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    $('#updateInfo').click(function () {
        let uid = firebase.auth().currentUser.uid;
        console.log(image);
        if (image) {
            const userFolder = firebase.storage().ref(uid).child('avatars').child(image.name);
            userFolder.put(image).then(snap => {
                snap.ref.getDownloadURL().then(async url => {
                    await sendInformationData(url);
                })
            });
        } else {
            sendInformationData('/images/avatar-icon.png')
        }
    });

    function sendInformationData(url) {
        let data;
        if (latitude !== 0 || longitude !== 0) {
             data = {
                avatar: url,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                address: document.getElementById('address').value,
                latitude: latitude,
                longitude: longitude
            };
        } else {
            data = {
                avatar: url,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                address: document.getElementById('address').value
            };
        }
        let xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('POST', '/updateInfo', false);
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
        xmlHttpRequest.send(JSON.stringify(data));
    }
});

