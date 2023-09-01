var map;
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(storeCoords);
} else {
  console.log("Geolocation is not supported by this browser.")

}
//default lat long if gelocation is not supported (and storeCoords doesnt run)
mylat = 51.37767660722309;
mylong = -2.3510909463355967;
console.log("start", mylat, mylong)
// main draw map function
function storeCoords(position) {
  console.log("reading from browser")
  //get lat and long from current location
  mylat = position.coords.latitude;
  mylong = position.coords.longitude;
  console.log("inside", mylat, mylong)
  try {
    //create map centered on users location
    map = L.map('map').setView([mylat, mylong], 17, {
      zoomControl: false
    });
  }
  catch {
    console.warn("Map not loaded - only happens occasionally!")
  }

  // build tile map 
  var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 34,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);


  //draws small circle on users position
  var circle = L.circle([mylat, mylong], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.1,
    radius: 10
  }).addTo(map).bindPopup('YOU ARE HERE');


  // calls my function to get data from bathhacked
  fetchInfo2()
  //define my blue icon with its shadow 
  //TODO should really be a bin icon!
  var myIcon = L.icon({
    iconUrl: 'my-icon.png',
    iconSize: [32, 65],
    iconAnchor: [16, 65],
    popupAnchor: [-3, -76],
    shadowUrl: 'my-icon-shadow.png',
    shadowSize: [34, 65],
    shadowAnchor: [16, 65]
  });
  //declare function to actually get the info
  //info is on 13 pages of 100 bins
  //so I am doing nested looping
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
          //this only happens on last page - I dont think there are a full 100 on that page
          console.log("error when getting location")
        }//end catch
      }// end for 100
    }//end for 14
  }//end async function


}//end store coords
console.log("outside", mylat, mylong)




