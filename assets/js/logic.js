var apikey = "f64fb3ab0039c0d8c7bf10bda969375a";
var searchTerm = document.querySelector("#artist-search");

//ensures that the user entered something into the search field
var formHandler = function(event) {
  //prevents the page from refreshing on submit
  event.preventDefault();

  if (searchTerm) {
    getArtistInfo();
  }
  else {
    alert("Please enter an artist name");
  }
}

//gets inputed artist info
var getArtistInfo = function() {
  var artistName = searchTerm.value;
  var apiUrl = "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=" + artistName + "&api_key=" + apikey + "&format=json";
  
  fetch(apiUrl).then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
        });
        } else {
          alert("Artist not found");
        }
      })
    }

    searchTerm.addEventListener("submit", formHandler)
    