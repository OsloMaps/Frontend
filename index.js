var polysSelected = [];
var data;

function closeInfoBox(){
    var info_box = document.getElementById('info-box');
    info_box.style.visibility= "hidden";
}

function arrayEqual(a1, a2){
    if(a1.length!=a2.length){
        return false;
    }
    for (var i = 0; i < a1.length; i++){
        if(a1[i]!=a2[i]){
            return false;
        }
    }
    return true;
}

function polygonClick(e){
    console.log(e.originalEvent.ctrlKey);
    if(!e.originalEvent.ctrlKey){
        for(let oldPoly of polysSelected){
            oldPoly.setStyle({fillOpacity : 0.5,
                        opacity : 0.5,
                        color: oldPoly.options.oldColor});
    }
    polysSelected = [];
    }
    var polygon = e.target;
    polygon.setStyle({fillOpacity : 0,
                    opacity : 1,
                      color: "red"});
    var info_box = document.getElementById('info-box');
    var alreadyIn = false;
    var index = polysSelected.indexOf(polygon);
    if(index==-1){
        polysSelected.push(polygon);
    }else{
        polygon.setStyle({fillOpacity : 0.5,
                        opacity : 0.5,
                        color: polygon.options.oldColor});
        polysSelected.splice(index,1);
    }
    if(polysSelected.length == 1){
        var polygon = polysSelected[0];
        var grunnKrets = data["Grenser"][polygon.options.dataIndeks];
        info_box.style.visibility= "visible";
        var info_box_text = document.getElementById("info-box-text");
        info_box_text.innerHTML = "<h1>" + grunnKrets.GrunnkretsNavn +
	    "</h1><h2><br>Bydel: " + grunnKrets.BydelNavn +
	    "</h2><h3>Innbyggertall: " + grunnKrets.InnbyggerTall + "</h3>";
    }else if(polysSelected.length==0){
        info_box.style.visibility= "hidden";
    }else{
        var grunnKrets = data["Grenser"][polysSelected[0].options.dataIndeks];
        var grunnkretser = [grunnKrets.GrunnkretsNavn];
        var innbyggertall = grunnKrets.InnbyggerTall;
        for(let poly of polysSelected.slice(1)){
            grunnKrets = data["Grenser"][poly.options.dataIndeks];
            grunnkretser.push(grunnKrets.GrunnkretsNavn);
            innbyggertall+=grunnKrets.InnbyggerTall
        }
        grunnkretser.sort();
        var grunnkretsTekst = "Grunnkretser: " + grunnkretser[0];
        var prev = grunnkretser[0].split(" ");
        for(let gk of grunnkretser.slice(1)){
            console.log(prev.slice(0,-1));
            console.log(gk.split(" ").slice(0,-1));
            if(arrayEqual(prev.slice(0,-1),gk.split(" ").slice(0,-1))){
                var split = gk.split(" ");
                grunnkretsTekst += ", " + split[split.length-1];
            }else{
                grunnkretsTekst += ", " + gk;
            }
            prev = gk.split(" ");
        }
         var info_box = document.getElementById('info-box');
        info_box.style.visibility= "visible";
        var info_box_text = document.getElementById("info-box-text");
        info_box_text.innerHTML = "<h3>" + grunnkretsTekst +
	    "</h3><h3>Innbyggertall: " + innbyggertall + "</h3>";
    }
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
	        polygon.bindTooltip(place["GrunnkretsNavn"], {sticky: true});
            polygon.on("click", polygonClick);
        }
    }
}

function loadMap() {
    var mymap = L.map('map').setView([59.90, 10.75], 12);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3JkYm9rYSIsImEiOiJja3JuYTczazgxaThpMzFsaXhuYWhuY3J6In0.Xm4vpvJ9lmIa_J1qZT2L3Q', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/satellite-streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoib3JkYm9rYSIsImEiOiJja3JuYTczazgxaThpMzFsaXhuYWhuY3J6In0.Xm4vpvJ9lmIa_J1qZT2L3Q'
    }).addTo(mymap);
    loadGrunnkretser(mymap);
}
window.onload = loadMap;
