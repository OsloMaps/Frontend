var oldPoly = null;

function polygonClick(e){
    if(oldPoly != null){
        oldPoly.setStyle({fillOpacity : 0.5,
                    opacity : 0.5,
                    color: oldPoly.options.oldColor});
    }
    var polygon = e.target;
    polygon.setStyle({fillOpacity : 0,
                    opacity : 1,
                    color: "red"});
    oldPoly = polygon;
}

function loadGrunnkretser(map){
    let requestURL = 'http://localhost:5000/grenser/grunnkrets';
    console.log(location.hostname);
    if(location.hostname == "oslomapsfrontend.azurewebsites.net") {
        requestURL = 'https://oslomapsbackend.azurewebsites.net/grenser/grunnkrets';
    }
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function() {
        const data = JSON.parse(request.response);
        for (const place of data["Grenser"]){
            let coords = [];
            arr = place["Koordinater"];
            for (const coord of arr){
                coords.push([coord[0], coord[1]]);
            }
            var polygon = L.polygon(coords,{
                fillColor: place["BydelFarge"],
                color: place["BydelFarge"],
                opacity: 0.5,
                fillOpacity: 0.5,
                oldColor: place["BydelFarge"]
            }).addTo(map);
            polygon.bindPopup("<h1>" + place["GrunnkretsNavn"] + "</h1>" +
                " <h2> Bydel: " + place["BydelNavn"] + "</h2>" +
                " <h2> Innbyggere: " + place["InnbyggerTall"] + "</h2>");
            polygon.on("click", polygonClick);
        }
    }
}

function loadMap() {
    var mymap = L.map('map').setView([59.90, 10.75], 12);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3JkYm9rYSIsImEiOiJja3JuYTczazgxaThpMzFsaXhuYWhuY3J6In0.Xm4vpvJ9lmIa_J1qZT2L3Q', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoib3JkYm9rYSIsImEiOiJja3JuYTczazgxaThpMzFsaXhuYWhuY3J6In0.Xm4vpvJ9lmIa_J1qZT2L3Q'
    }).addTo(mymap);
    loadGrunnkretser(mymap);
}
window.onload = loadMap;
