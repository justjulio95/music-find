var apikey = "f64fb3ab0039c0d8c7bf10bda969375a"
var artistSearch = document.getElementById("search-text")

var getArtistInfo = function() {
  var artistName = "Cher";
  var apiUrl = "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=" + artistName + "&api_key=" + apikey + "&format=json" 
  console.log(apiUrl);
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
    