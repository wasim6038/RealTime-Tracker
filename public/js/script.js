const socket = io();

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Wasim"
}).addTo(map);

const markers = {};

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Update or create marker for current user
        if (markers['current']) {
            markers['current'].setLatLng([latitude, longitude]);
        } else {
            markers['current'] = L.marker([latitude, longitude]).addTo(map);
        }

        // Center map on current location
        map.setView([latitude, longitude], 15);
            
        // Send location to server
        socket.emit("sendLocation", { latitude, longitude });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

socket.on("receiveLocation", (data) => {
    const { id, latitude, longitude} = data;
    
    // Update or create marker for other users
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude], {
            icon: L.divIcon({
                className: 'other-user-marker',
                html: '👤',
                iconSize: [50, 50]
            })
        }).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});