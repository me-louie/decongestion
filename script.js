var mapBoxAPI = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'

// max/min coordinates for CoV region
var bbox = 'bbox=-123.28965644634036,49.181803990270794,-122.97949367449506,49.322155168068576'
var token = '&access_token=pk.eyJ1IjoibWVsb3VpZSIsImEiOiJjazJyc25wMHMwMm9xM2NvM2tkNzhveGx1In0.SaPSr8Knxoezj-zQC2TZkA'

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}



function searchFunction() {
  var x = document.getElementById("myInput").value;
  if (addresses.includes(x)) {
    var index = addresses.findIndex(function(address) {return address == x});
    var result = urls[index];
    // window.open(result, '_blank');
    makeIFrame(result);
  } else {
    let request = new XMLHttpRequest()
    let url = mapBoxAPI + x + '.json?' + bbox + token
    
    request.open('GET', url, true);
    request.onload = function() {
        let data = JSON.parse(request.responseText);

        let bestMatch = [data.features[0].geometry.coordinates[0], data.features[0].geometry.coordinates[1]];
        // document.getElementById("demo").innerHTML = data.features[0].geometry.coordinates[1] + ", " + data.features[0].geometry.coordinates[0];
        let final = [];
        final = shortestDistance(webcams, bestMatch);
        
        // document.getElementById("demo").innerHTML = final[0][4];
        makeIFrame(final[0][4]);

        // document.getElementById("demo").innerHTML = final[0][4];
    };    
    request.send();
    // document.getElementById("demo").innerHTML = data;  
  }
}

function makeIFrame(urlLink) {
  var iframe = document.createElement('iframe');
  iframe.src = urlLink;
  document.body.appendChild(iframe);
  console.log('iframe.contentWindow =', iframe.contentWindow);
}

function shortestDistance(coordinates, intersection) {
  var shortest = [[0.98,0,0],[0.99,0,0],[1,0,0]];
  for (i = 0; i < coordinates.length; i++) {
    distance = calcDistance(coordinates[i][0][0], coordinates[i][0][1], intersection[0], intersection[1]);
    if (distance < shortest[0][0]) {
      shortest[2] = shortest[1];
      shortest[1] = shortest[0];
      shortest[0] = [distance, coordinates[i][0][0], coordinates[i][0][1], coordinates[i][1], coordinates[i][2]];
    } else if (distance < shortest[1][0]) {
      shortest[2] = shortest[1];
      shortest[1] = [distance, coordinates[i][0][0], coordinates[i][0][1], coordinates[i][1], coordinates[i][2]];
    } else if (distance < shortest[2][0]) {
      shortest[2] = [distance, coordinates[i][0][0], coordinates[i][0][1], coordinates[i][1], coordinates[i][2]];
    }
  }
  return shortest;
}

function calcDistance (lat, long, intery, interx) {
  var distance = Math.sqrt(Math.pow(long-interx,2)+Math.pow(lat-intery,2))
  return distance;
}

shortestDistance([[[49.123456, 135.123456],"one","two"], [[49.033456, 135.033456],"three","four"], [[49.043456, 135.043456],"five","six"]], [49.023456, 135.0234567]);

var addresses = [
"Cardero St and W Pender St and W Georgia",
"Rupert St and Grandview Hwy",
"Cambie Bridge",
"Cambie St and W 12th Av",
"Burrard St and Cornwall Av",
"Cassiar Connector and E Hastings St",
"Knight St and E 41st Av",
"Knight St and E 57th Av",
"Main St and E 33rd Av",
"Burrard St and Canada Place",
"Main St and E 2nd Av",
"Commercial Drive and E 1st Av",
"Commercial Drive and E Broadway",
"Hornby St and W Georgia St",
"Clark Drive and Powell St",
"Clark Drive and E Hastings St",
"Howe St and W Georgia St",
"Granville St and Robson St",
"Joyce St and Kingsway",
"Renfrew St and E Broadway",
"Glen Drive and Powell St",
"Knight St and King Edward Av",
"Knight St and SE Marine Drive",
"Burrard St and W 4th Av",
"River District Crossing and Marine Way",
"Cambie St and W 33rd Av",
"Blanca St and W 10th Av",
"Arbutus St and W 16th Av",
"Arbutus St and W Broadway",
"Joyce St and Vanness Av",
"Cornish St and SW Marine drive",
"Seymour St and Nelson St",
"Kingsway and E 11th Av",
"Clark Drive and E 1st Av",
"Denman St and W Georgia St",
"Granville St and W Broadway",
"Granville St and W 70th Av",
"Cambie St and W 16th Av",
"Burrard St and Pacific St",
"Boundary Road and E Hastings St",
"North End 1",
"Expo Blvd and Smithe St",
"Cambie St and Nelson St",
"Renfrew St and E Hastings St",
"Cambie St and W Broadway",
"Main St and E Hastings St",
"Beatty St and Dunsmuir St",
"Granville St and W Georgia St",
"Beatty St and W Georgia St",
"Granville St and Nelson St",
"Clark Drive and E 12th Av",
"Hornby St and Pacific St",
"Macdonald St and W 4th Av",
"Nanaimo St and E Hastings St",
"Alma St and W 10th Av",
"Arbutus St and W King Edward Av",
"Kinross St and Marine Way",
"Kerr St and SE Marine Drive",
"SW Marine Drive and W 41st Av",
"SW Marine Drive and W 49th Av",
"Slocan St and Kingsway",
"Quebec St and Switchmen St",
"Boundary Rd and E 1st Av",
"Clark Drive and E Broadway",
"Boundary Road and Canada Way",
"Thurlow St and Canada Place",
"Burrard St Bridge",
"Arbutus St and W 12th Av",
"Arbutus Greenway and W Broadway",
"Arbutus Greenway and SW Marine Drive",
"Quebec St and W 2nd Av",
"Oak St and W 70th Av",
"Chilco St and W Georgia St",
"Stanley Park Causeway",
"North End 2",
"Cambie St and W 49th Av",
"Cambie St and W 41st Av",
"Cambie St and W King Edward Av",
"Main St and Terminal Av",
"Granville St and Dunsmuir St",
"Cambie St and SW Marine Drive",
"Main St and Kingsway",
"Boundary Road and Grandview Hwy",
"Earles St and Kingsway",
"Hornby St and Robson St",
"Nanaimo St and E 24th Av",
"Bute St and Davie St",
"Knight St and Kingsway",
"Thurlow St and Pacific St",
"SE Marine Drive and Marine Way",
"Sawmill East Crescent and Marine Way",
"Sawmill West Crescent and Marine Way",
"Beatty St and Smithe St",
"Renfrew St and E 22nd Av",
"Oak St and W 33rd Av",
"Boundary Road and Kingsway",
"Arbutus Greenway and W 12th Av",
"Boundary Rd and Vanness Av",
"Oak St and W 10th Av",
"Yukon St and SW Marine Drive",
"Burrard St and Drake St",
"McLean Drive and Powell St",
"Carolina St and Great Northern Way"
];

var urls = ["https://trafficcams.vancouver.ca/georgia3.htm",
"https://trafficcams.vancouver.ca/grandview4.htm",
"https://trafficcams.vancouver.ca/cambiebridge.htm",
"https://trafficcams.vancouver.ca/12th.htm",
"https://trafficcams.vancouver.ca/BurrardCornwall4.htm",
"https://trafficcams.vancouver.ca/cassiarHastings.htm",
"https://trafficcams.vancouver.ca/knight.htm",
"https://trafficcams.vancouver.ca/knight57.htm",
"https://trafficcams.vancouver.ca/main33.htm",
"https://trafficcams.vancouver.ca/BurrardCanadaPlace.htm",
"https://trafficcams.vancouver.ca/Main2.htm",
"https://trafficcams.vancouver.ca/Commercial01.htm",
"https://trafficcams.vancouver.ca/commercialBroadway.htm",
"https://trafficcams.vancouver.ca/hornbyGeorgia.htm",
"https://trafficcams.vancouver.ca/ClarkPowell.htm",
"https://trafficcams.vancouver.ca/ClarkHastings.htm",
"https://trafficcams.vancouver.ca/howeGeorgia.htm",
"https://trafficcams.vancouver.ca/granvilleRobson.htm",
"https://trafficcams.vancouver.ca/joyceKingsway.htm",
"https://trafficcams.vancouver.ca/renfrewBroadway.htm",
"https://trafficcams.vancouver.ca/glenPowell.htm",
"https://trafficcams.vancouver.ca/knightKingEdward.htm",
"https://trafficcams.vancouver.ca/knightMarineBridge.htm",
"https://trafficcams.vancouver.ca/burrard4.htm",
"https://trafficcams.vancouver.ca/RiverDistrictMarine.htm",
"https://trafficcams.vancouver.ca/cambie33.htm",
"https://trafficcams.vancouver.ca/blanca10.htm",
"https://trafficcams.vancouver.ca/arbutus16.htm",
"https://trafficcams.vancouver.ca/arbutusBroadway.htm",
"https://trafficcams.vancouver.ca/joyceVanness.htm",
"https://trafficcams.vancouver.ca/cornishSWMarine.htm",
"https://trafficcams.vancouver.ca/seymourNelson.htm",
"https://trafficcams.vancouver.ca/kingsway11.htm",
"https://trafficcams.vancouver.ca/clark4.htm",
"https://trafficcams.vancouver.ca/denman3.htm",
"https://trafficcams.vancouver.ca/broadwayGranville.htm",
"https://trafficcams.vancouver.ca/granville70th.htm",
"https://trafficcams.vancouver.ca/cambie16th.htm",
"https://trafficcams.vancouver.ca/BurrardPacific4.htm",
"https://trafficcams.vancouver.ca/hastings.htm",
"http://images.drivebc.ca/bchighwaycam/pub/html/www/18.html",
"https://trafficcams.vancouver.ca/expoSmithe.htm",
"https://trafficcams.vancouver.ca/cambieNelson.htm",
"https://trafficcams.vancouver.ca/renfrewHastings.htm",
"https://trafficcams.vancouver.ca/cambieBroadway.htm",
"https://trafficcams.vancouver.ca/MainHastings.htm",
"https://trafficcams.vancouver.ca/BeattyDunsmuir.htm",
"https://trafficcams.vancouver.ca/granvilleGeorgia.htm",
"https://trafficcams.vancouver.ca/beattyGeorgia.htm",
"https://trafficcams.vancouver.ca/granvilleNelson.htm",
"https://trafficcams.vancouver.ca/clark12.htm",
"https://trafficcams.vancouver.ca/hornbyPacific.htm",
"https://trafficcams.vancouver.ca/macdonald4.htm",
"https://trafficcams.vancouver.ca/nanaimoHastings.htm",
"https://trafficcams.vancouver.ca/alma10.htm",
"https://trafficcams.vancouver.ca/arbutusWKingEdward.htm",
"https://trafficcams.vancouver.ca/kinrossMarine.htm",
"https://trafficcams.vancouver.ca/kerrMarine.htm",
"https://trafficcams.vancouver.ca/marine41.htm",
"https://trafficcams.vancouver.ca/marine49.htm",
"https://trafficcams.vancouver.ca/slocanKingsway.htm",
"https://trafficcams.vancouver.ca/quebecSwitchmen.htm",
"https://trafficcams.vancouver.ca/boundary1.htm",
"https://trafficcams.vancouver.ca/clarkBroadway.htm",
"https://trafficcams.vancouver.ca/boundaryCanadaWay.htm",
"https://trafficcams.vancouver.ca/ThurlowCanadaPlace.htm",
"https://trafficcams.vancouver.ca/BurrardBridge.htm",
"https://trafficcams.vancouver.ca/arbutus12.htm",
"https://trafficcams.vancouver.ca/greenwayBroadway.htm",
"https://trafficcams.vancouver.ca/arbutusGreenwaySWMarine.htm",
"https://trafficcams.vancouver.ca/quebec2.htm",
"https://trafficcams.vancouver.ca/oak4.htm",
"http://images.drivebc.ca/bchighwaycam/pub/html/www/19.html",
"http://images.drivebc.ca/bchighwaycam/pub/html/www/17.html",
"http://images.drivebc.ca/bchighwaycam/pub/html/www/20.html",
"https://trafficcams.vancouver.ca/cambie49.htm",
"https://trafficcams.vancouver.ca/cambie41.htm",
"https://trafficcams.vancouver.ca/cambie25.htm",
"https://trafficcams.vancouver.ca/mainTerminal.htm",
"https://trafficcams.vancouver.ca/GranvilleDunsmuir.htm",
"https://trafficcams.vancouver.ca/CambieMarine.htm",
"https://trafficcams.vancouver.ca/mainKingsway7.htm",
"https://trafficcams.vancouver.ca/BoundaryGrandviewHwy.htm",
"https://trafficcams.vancouver.ca/EarlesKingsway.htm",
"https://trafficcams.vancouver.ca/HornbyRobson.htm",
"https://trafficcams.vancouver.ca/nanaimo24.htm",
"https://trafficcams.vancouver.ca/buteDavie.htm",
"https://trafficcams.vancouver.ca/knightKingsway.htm",
"https://trafficcams.vancouver.ca/thurlowPacific.htm",
"https://trafficcams.vancouver.ca/marineMarineWay.htm",
"https://trafficcams.vancouver.ca/SawmillEastMarine.htm",
"https://trafficcams.vancouver.ca/SawmillWestMarine.htm",
"https://trafficcams.vancouver.ca/beattySmithe.htm",
"https://trafficcams.vancouver.ca/renfrew22.htm",
"https://trafficcams.vancouver.ca/oak33.htm",
"https://trafficcams.vancouver.ca/boundaryKingsway.htm",
"https://trafficcams.vancouver.ca/greenway12.htm",
"https://trafficcams.vancouver.ca/boundaryVanness.htm",
"https://trafficcams.vancouver.ca/oakW10.htm",
"https://trafficcams.vancouver.ca/yukonSWMarine.htm",
"https://trafficcams.vancouver.ca/burrardDrake.htm",
"https://trafficcams.vancouver.ca/mcleanPowell.htm",
"https://trafficcams.vancouver.ca/carolinaGreatNorthern.htm"
]

var webcams = [[[-123.130520302544, 49.290510806346],"Cardero St and W Pender St and W Georgia","https://trafficcams.vancouver.ca/georgia3.htm"],
[[-123.033764228688, 49.2581519344414],"Rupert St and Grandview Hwy","https://trafficcams.vancouver.ca/grandview4.htm"],
[[-123.114886176233, 49.2667756269949],"Cambie Bridge","https://trafficcams.vancouver.ca/cambiebridge.htm"],
[[-123.114967985868, 49.2603889490707],"Cambie St and W 12th Av","https://trafficcams.vancouver.ca/12th.htm"],
[[-123.146200846216, 49.2728254984234],"Burrard St and Cornwall Av","https://trafficcams.vancouver.ca/BurrardCornwall4.htm"],
[[-123.030835801938, 49.2811264797669],"Cassiar Connector and E Hastings St","https://trafficcams.vancouver.ca/cassiarHastings.htm"],
[[-123.077030889534, 49.2327151572131],"Knight St and E 41st Av","https://trafficcams.vancouver.ca/knight.htm"],
[[-123.07702523194, 49.2181272253316],"Knight St and E 57th Av","https://trafficcams.vancouver.ca/knight57.htm"],
[[-123.101486354168, 49.2405023736559],"Main St and E 33rd Av","https://trafficcams.vancouver.ca/main33.htm"],
[[-123.115479083554, 49.2881431972814],"Burrard St and Canada Place","https://trafficcams.vancouver.ca/BurrardCanadaPlace.htm"],
[[-123.100696908039, 49.2691679881689],"Main St and E 2nd Av","https://trafficcams.vancouver.ca/Main2.htm"],
[[-123.069621664266, 49.2695996340758],"Commercial Drive and E 1st Av","https://trafficcams.vancouver.ca/Commercial01.htm"],
[[-123.069762688147, 49.2623194551024],"Commercial Drive and E Broadway","https://trafficcams.vancouver.ca/commercialBroadway.htm"],
[[-123.120082749606, 49.2837645081745],"Hornby St and W Georgia St","https://trafficcams.vancouver.ca/hornbyGeorgia.htm"],
[[-123.07711, 49.28309],"Clark Drive and Powell St","https://trafficcams.vancouver.ca/ClarkPowell.htm"],
[[-123.07711, 49.28131],"Clark Drive and E Hastings St","https://trafficcams.vancouver.ca/ClarkHastings.htm"],
[[-123.119088, 49.2831269],"Howe St and W Georgia St","https://trafficcams.vancouver.ca/howeGeorgia.htm"],
[[-123.119829, 49.2813697],"Granville St and Robson St","https://trafficcams.vancouver.ca/granvilleRobson.htm"],
[[-123.035859, 49.2341556],"Joyce St and Kingsway","https://trafficcams.vancouver.ca/joyceKingsway.htm"],
[[-123.044285, 49.261973],"Renfrew St and E Broadway","https://trafficcams.vancouver.ca/renfrewBroadway.htm"],
[[-123.081247, 49.282787],"Glen Drive and Powell St","https://trafficcams.vancouver.ca/glenPowell.htm"],
[[-123.07614, 49.248518],"Knight St and King Edward Av","https://trafficcams.vancouver.ca/knightKingEdward.htm"],
[[-123.077205, 49.211117],"Knight St and SE Marine Drive","https://trafficcams.vancouver.ca/knightMarineBridge.htm"],
[[-123.145657, 49.268027],"Burrard St and W 4th Av","https://trafficcams.vancouver.ca/burrard4.htm"],
[[-123.03084, 49.206881],"River District Crossing and Marine Way","https://trafficcams.vancouver.ca/RiverDistrictMarine.htm"],
[[-123.118386, 49.241057],"Cambie St and W 33rd Av","https://trafficcams.vancouver.ca/cambie33.htm"],
[[-123.215244, 49.264017],"Blanca St and W 10th Av","https://trafficcams.vancouver.ca/blanca10.htm"],
[[-123.153058, 49.257275],"Arbutus St and W 16th Av","https://trafficcams.vancouver.ca/arbutus16.htm"],
[[-123.152958, 49.263817],"Arbutus St and W Broadway","https://trafficcams.vancouver.ca/arbutusBroadway.htm"],
[[-123.031797, 49.23839],"Joyce St and Vanness Av","https://trafficcams.vancouver.ca/joyceVanness.htm"],
[[-123.142148, 49.208558],"Cornish St and SW Marine drive","https://trafficcams.vancouver.ca/cornishSWMarine.htm"],
[[-123.122022, 49.278617],"Seymour St and Nelson St","https://trafficcams.vancouver.ca/seymourNelson.htm"],
[[-123.097767, 49.261081],"Kingsway and E 11th Av","https://trafficcams.vancouver.ca/kingsway11.htm"],
[[-123.130252725283, 49.2084701202487],"Clark Drive and E 1st Av","https://trafficcams.vancouver.ca/clark4.htm"],
[[-123.136787449782, 49.2942590380806],"Denman St and W Georgia St","https://trafficcams.vancouver.ca/denman3.htm"],
[[-123.136736007805, 49.2972589838826],"Granville St and W Broadway","https://trafficcams.vancouver.ca/broadwayGranville.htm"],
[[-123.129968, 49.324891],"Granville St and W 70th Av","https://trafficcams.vancouver.ca/granville70th.htm"],
[[-123.116492357278, 49.2261139995231],"Cambie St and W 16th Av","https://trafficcams.vancouver.ca/cambie16th.htm"],
[[-123.116192190431, 49.2335434721856],"Burrard St and Pacific St","https://trafficcams.vancouver.ca/BurrardPacific4.htm"],
[[-123.115406053889, 49.248990875309],"Boundary Road and E Hastings St","https://trafficcams.vancouver.ca/hastings.htm"],
[[-123.100028035364, 49.2727762979223],"North End 1","http://images.drivebc.ca/bchighwaycam/pub/html/www/18.html"],
[[-123.116411709855, 49.2836239860524],"Expo Blvd and Smithe St","https://trafficcams.vancouver.ca/expoSmithe.htm"],
[[-123.117110735151, 49.2101449448247],"Cambie St and Nelson St","https://trafficcams.vancouver.ca/cambieNelson.htm"],
[[-123.10089513196, 49.2644481387721],"Renfrew St and E Hastings St","https://trafficcams.vancouver.ca/renfrewHastings.htm"],
[[-123.02361, 49.25822],"Cambie St and W Broadway","https://trafficcams.vancouver.ca/cambieBroadway.htm"],
[[-123.04881, 49.23758],"Main St and E Hastings St","https://trafficcams.vancouver.ca/MainHastings.htm"],
[[-123.121791, 49.2826429],"Beatty St and Dunsmuir St","https://trafficcams.vancouver.ca/BeattyDunsmuir.htm"],
[[-123.056641, 49.248805],"Granville St and W Georgia St","https://trafficcams.vancouver.ca/granvilleGeorgia.htm"],
[[-123.133382, 49.281777],"Beatty St and W Georgia St","https://trafficcams.vancouver.ca/beattyGeorgia.htm"],
[[-123.076038, 49.250101],"Granville St and Nelson St","https://trafficcams.vancouver.ca/granvilleNelson.htm"],
[[-123.134406, 49.278304],"Clark Drive and E 12th Av","https://trafficcams.vancouver.ca/clark12.htm"],
[[-123.038991, 49.207814],"Hornby St and Pacific St","https://trafficcams.vancouver.ca/hornbyPacific.htm"],
[[-123.027149, 49.2064],"Macdonald St and W 4th Av","https://trafficcams.vancouver.ca/macdonald4.htm"],
[[-123.033566, 49.207032],"Nanaimo St and E Hastings St","https://trafficcams.vancouver.ca/nanaimoHastings.htm"],
[[-123.11558, 49.276527],"Alma St and W 10th Av","https://trafficcams.vancouver.ca/alma10.htm"],
[[-123.044345, 49.250539],"Arbutus St and W King Edward Av","https://trafficcams.vancouver.ca/arbutusWKingEdward.htm"],
[[-123.127873, 49.241388],"Kinross St and Marine Way","https://trafficcams.vancouver.ca/kinrossMarine.htm"],
[[-123.023649, 49.23228],"Kerr St and SE Marine Drive","https://trafficcams.vancouver.ca/kerrMarine.htm"],
[[-123.1546702, 49.2610022],"SW Marine Drive and W 41st Av","https://trafficcams.vancouver.ca/marine41.htm"],
[[-123.023703, 49.234379],"SW Marine Drive and W 49th Av","https://trafficcams.vancouver.ca/marine49.htm"],
[[-123.126628, 49.26244],"Slocan St and Kingsway","https://trafficcams.vancouver.ca/slocanKingsway.htm"],
[[-123.114864, 49.211016],"Quebec St and Switchmen St","https://trafficcams.vancouver.ca/quebecSwitchmen.htm"],
[[-123.130775, 49.278025],"Boundary Rd and E 1st Av","https://trafficcams.vancouver.ca/boundary1.htm"],
[[-123.074029, 49.283234],"Clark Drive and E Broadway","https://trafficcams.vancouver.ca/clarkBroadway.htm"],
[[-123.090919, 49.266785],"Boundary Road and Canada Way","https://trafficcams.vancouver.ca/boundaryCanadaWay.htm"],
[[-123.077346577693, 49.2696673278744],"Thurlow St and Canada Place","https://trafficcams.vancouver.ca/ThurlowCanadaPlace.htm"],
[[-123.133742210751, 49.2925940002885],"Burrard St Bridge","https://trafficcams.vancouver.ca/BurrardBridge.htm"],
[[-123.138554334693, 49.2635968497724],"Arbutus St and W 12th Av","https://trafficcams.vancouver.ca/arbutus12.htm"],
[[-123.140525163827, 49.2085840137306],"Arbutus Greenway and W Broadway","https://trafficcams.vancouver.ca/greenwayBroadway.htm"],
[[-123.115084873166, 49.256907684832],"Arbutus Greenway and SW Marine Drive","https://trafficcams.vancouver.ca/arbutusGreenwaySWMarine.htm"],
[[-123.132359942237, 49.2769754719523],"Quebec St and W 2nd Av","https://trafficcams.vancouver.ca/quebec2.htm"],
[[-123.023578, 49.2811188],"Oak St and W 70th Av","https://trafficcams.vancouver.ca/oak4.htm"],
[[-123.130653, 49.324053],"Chilco St and W Georgia St","http://images.drivebc.ca/bchighwaycam/pub/html/www/19.html"],
[[-123.114727137422, 49.2758069601355],"Stanley Park Causeway","http://images.drivebc.ca/bchighwaycam/pub/html/www/17.html"],
[[-123.118130911495, 49.2761048691871],"North End 2","http://images.drivebc.ca/bchighwaycam/pub/html/www/20.html"],
[[-123.044076554126, 49.2811221877658],"Cambie St and W 49th Av","https://trafficcams.vancouver.ca/cambie49.htm"],
[[-123.114883421659, 49.2632184560264],"Cambie St and W 41st Av","https://trafficcams.vancouver.ca/cambie41.htm"],
[[-123.099648798315, 49.2813356595642],"Cambie St and W King Edward Av","https://trafficcams.vancouver.ca/cambie25.htm"],
[[-123.110542, 49.2798513],"Main St and Terminal Av","https://trafficcams.vancouver.ca/mainTerminal.htm"],
[[-123.11812055027, 49.2824942805362],"Granville St and Dunsmuir St","https://trafficcams.vancouver.ca/GranvilleDunsmuir.htm"],
[[-123.112273646781, 49.2787098421077],"Cambie St and SW Marine Drive","https://trafficcams.vancouver.ca/CambieMarine.htm"],
[[-123.123013825971, 49.2792581951786],"Main St and Kingsway","https://trafficcams.vancouver.ca/mainKingsway7.htm"],
[[-123.077555176815, 49.259622152424],"Boundary Road and Grandview Hwy","https://trafficcams.vancouver.ca/BoundaryGrandviewHwy.htm"],
[[-123.131337, 49.2763164],"Earles St and Kingsway","https://trafficcams.vancouver.ca/EarlesKingsway.htm"],
[[-123.16831, 49.26837],"Hornby St and Robson St","https://trafficcams.vancouver.ca/HornbyRobson.htm"],
[[-123.056587, 49.281123],"Nanaimo St and E 24th Av","https://trafficcams.vancouver.ca/nanaimo24.htm"],
[[-123.185885, 49.263478],"Bute St and Davie St","https://trafficcams.vancouver.ca/buteDavie.htm"],
[[-123.153114, 49.25154],"Knight St and Kingsway","https://trafficcams.vancouver.ca/knightKingsway.htm"],
[[-123.036666, 49.20693],"Thurlow St and Pacific St","https://trafficcams.vancouver.ca/thurlowPacific.htm"],
[[-123.042261, 49.208109],"SE Marine Drive and Marine Way","https://trafficcams.vancouver.ca/marineMarineWay.htm"],
[[-123.196716, 49.234772],"Sawmill East Crescent and Marine Way","https://trafficcams.vancouver.ca/SawmillEastMarine.htm"],
[[-123.171398, 49.227355],"Sawmill West Crescent and Marine Way","https://trafficcams.vancouver.ca/SawmillWestMarine.htm"],
[[-123.05403, 49.240012],"Beatty St and Smithe St","https://trafficcams.vancouver.ca/beattySmithe.htm"],
[[-123.102278, 49.271224],"Renfrew St and E 22nd Av","https://trafficcams.vancouver.ca/renfrew22.htm"],
[[-123.023648, 49.269455],"Oak St and W 33rd Av","https://trafficcams.vancouver.ca/oak33.htm"],
[[-123.077509, 49.262375],"Boundary Road and Kingsway","https://trafficcams.vancouver.ca/boundaryKingsway.htm"],
[[-123.02371, 49.254887],"Arbutus Greenway and W 12th Av","https://trafficcams.vancouver.ca/greenway12.htm"],
[[-123.118271, 49.288853],"Boundary Rd and Vanness Av","https://trafficcams.vancouver.ca/boundaryVanness.htm"],
[[-123.136732, 49.275566],"Oak St and W 10th Av","https://trafficcams.vancouver.ca/oakW10.htm"],
[[-123.153051, 49.260993],"Yukon St and SW Marine Drive","https://trafficcams.vancouver.ca/yukonSWMarine.htm"],
[[-123.1545301, 49.2637721],"Burrard St and Drake St","https://trafficcams.vancouver.ca/burrardDrake.htm"],
[[-123.14447, 49.208597],"McLean Drive and Powell St","https://trafficcams.vancouver.ca/mcleanPowell.htm"],
[[-123.102702, 49.269206],"Carolina St and Great Northern Way","https://trafficcams.vancouver.ca/carolinaGreatNorthern.htm"],
]

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), addresses);
