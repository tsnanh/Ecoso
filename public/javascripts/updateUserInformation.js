$(document).ready(function () {
    let image;
    let input = document.getElementById('profilePhoto');

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
                sendInformationData('/images/ecoso_logo.png')
            }
        });
    });

    function sendInformationData(url) {

        let data = {
            avatar: url,
            name: document.getElementById('name').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            address: document.getElementById('address').value,
            gender: $('input[name="gender"]:checked').val()
        };
        $.ajax({
            url: '/updateInfo',
            method: 'POST',
            data: data
        }).done(() => {
            window.open('/', '_self')
        })
    }
});



