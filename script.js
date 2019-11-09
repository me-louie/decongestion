

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
    window.open(result, '_blank');
  } else {
    var request = new XMLHttpRequest()
    var url = mapBoxAPI + x + '.json?' + bbox + token
    
    var bestMatch = [];
    
    request.open('GET', url);
    request.onload = function() {
        var data = JSON.parse(request.responseText);
        console.log(JSON.parse(JSON.stringify(data)));
        console.log("hello");
        bestMatch.push(data.features[0].geometry.coordinates[1]);
        bestMatch.push(data.features[0].geometry.coordinates[0]);
    };    
    request.send();
    document.getElementById("demo").innerHTML = bestMatch.length;  
  }
}

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

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), addresses);
