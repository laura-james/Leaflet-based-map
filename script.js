var map;
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(storeCoords);
} else {
  console.log("Geolocation is not supported by this browser.")

}
mylat = 51.37767660722309;
mylong = -2.3510909463355967;
console.log("start", mylat, mylong)
function storeCoords(position) {
  console.log("reading from browser")
  mylat = position.coords.latitude;
  mylong = position.coords.longitude;
  console.log("inside", mylat, mylong)
  try {
    map = L.map('map').setView([mylat, mylong], 17, {
      zoomControl: false
    });
  }
  catch {
    console.warn("map thing")
  }


  var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 34,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);



  var circle = L.circle([mylat, mylong], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.1,
    radius: 10
  }).addTo(map).bindPopup('your location');



  fetchInfo2()

  var myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconSize: [32, 65],
    iconAnchor: [16, 65],
    popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [34, 65],
    shadowAnchor: [16, 65]
  });
  async function fetchInfo2() {
    for (var page = 1; page < 14; page++) {
      var response = await fetch('https://data.bathhacked.org/api/datasets/17/rows?page=' + page + '&per_page=100');
      var json = await response.json();
      for (var i = 0; i < 100; i++) {
        //console.log(json["data"][i]);
        //console.log(json["data"][i]);
        try{
          lat = json["data"][i]["location"]["latitude"];
          long = json["data"][i]["location"]["longitude"];
          desc = json["data"][i]["locationdescription"]  ;
          var marker = L.marker([lat, long], { icon: myIcon }).addTo(map).bindPopup(desc);
        }
        catch{
          console.log("error when getting location")
        }
      }
    }
  }


}
console.log("outside", mylat, mylong)




