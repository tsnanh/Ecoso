function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(user => {
        firebase.auth().currentUser.getIdToken(true).then(idToken => {
            postSessionLogin('/login', idToken);
        })
    })
}

function postSessionLogin(url, idToken) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.open('/updateInfo', '_self');
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + idToken)
    xhr.send();
}

function signOut() {
    firebase.auth().signOut().then(promise => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/signOut', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                window.open('/', '_self');
            }
        };
        xhr.send();
    })
}