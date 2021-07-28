var oldPoly = null;
var data;

function polygonClick(e){
    if(oldPoly != null){
        oldPoly.setStyle({fillOpacity : 0.5,
                    opacity : 0.5,
                    color: oldPoly.options.oldColor});
    }
    var polygon = e.target;
    console.log(e);
    console.log(polygon);
    console.log("Klikk");
    polygon.setStyle({fillOpacity : 0,
                    opacity : 1,
                      color: "red"});
    oldPoly = polygon;
    var indeks = polygon.options.dataIndeks;
    console.log(indeks);
    console.log(data["Grenser"][indeks]);
}

function loadGrunnkretser(map){
    let requestURL = 'http://localhost:5000/grenser/grunnkrets';
    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = "json";
    request.send();
    request.onload = function() {
        data = JSON.parse(request.response);
	var i = 0;
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
                oldColor: place["BydelFarge"],
		dataIndeks : i
            }).addTo(map);
	    i++;
            polygon.bindPopup("<h1>" + place["GrunnkretsNavn"] + "</h1> <h2>" + place["BydelNavn"] + "</h2>")
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
