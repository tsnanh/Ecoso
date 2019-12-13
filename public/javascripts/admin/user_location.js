const firestore = firebase.firestore();



function initMaps() {
    firestore.collection('users').onSnapshot(snap => {
        let map = new google.maps.Map(document.getElementById('map'), {zoom: 14, scrollwheel: false});
        snap.forEach(doc => {
            const user = doc.data();
            const pos = {lat: user.latitude, lng: user.longitude};
            let icon = {
                url: user.avatar, // url
                scaledSize: new google.maps.Size(50, 50), // scaled size
                origin: new google.maps.Point(0,0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            };
            let marker = new google.maps.Marker({title: user.name, position: pos, map: map, icon: icon});
            marker.setMap(map)
            map.setCenter(pos);
            console.log(pos);
        })
    })
}

$(document).ready(function() {
    initMaps()
});