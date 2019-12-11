$(document).ready(function () {
    let image;
    let input = document.getElementById('profilePhoto');

    let latitude = 0;
    let longitude = 0;

    let uploadCrop = $('.croppie').croppie({
        url: 'https://icons-for-free.com/iconfiles/png/512/avatar+human+people+profile+user+icon-1320168139431219590.png',
        enableExif: true,
        viewport: {
            width: 200,
            height: 200,
            type: 'circle'
        },
        boundary: {
            width: 300,
            height: 300
        }
    });

    input.addEventListener('change', function (event) {
        $('#crop').css('display', 'block');
        let reader = new FileReader();
        reader.onload = (event) => {
            uploadCrop.croppie('bind', {url: event.target.result})
                .then(() => {
                })
        }
        reader.readAsDataURL(this.files[0]);
    });

    getLocation();
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async position => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
            });
        }
    }

    $('#updateInfo').click(function () {
        $('.croppie').croppie('result', {
            type: 'blob',
            size: 'viewport'
        }).then((response) => {
            image = response;
            let uid = firebase.auth().currentUser.uid;
            if (response) {
                const userFolder = firebase.storage().ref(uid).child('avatars').child(new Date().getTime().toString());
                userFolder.put(response).then(snap => {
                    snap.ref.getDownloadURL().then(url => {
                        sendInformationData(url);
                    })
                });
            } else {
                sendInformationData('/images/avatar-icon.png')
            }
        });
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
                longitude: longitude,
                gender: $('input[name="gender"]:checked').val()
            };
        } else {
            data = {
                avatar: url,
                dateOfBirth: document.getElementById('dateOfBirth').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                address: document.getElementById('address').value,
                gender: $('input[name="gender"]:checked').val()
            };
        }
        console.log(data)
        // let xmlHttpRequest = new XMLHttpRequest();
        // xmlHttpRequest.open('POST', '/updateInfo', false);
        // xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
        // xmlHttpRequest.send(JSON.stringify(data));
        $.ajax({
            url: '/updateInfo',
            method: 'POST',
            data: data
        }).done(() => {
            window.open('/', '_self')
        })
    }
});



