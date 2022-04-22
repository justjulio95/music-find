//LASTFM
var apikey = "f64fb3ab0039c0d8c7bf10bda969375a"
var artistSearch = document.getElementById("search-text")

var getArtistInfo = function() {
    // ensure the page doesn't auto-refresh with every search
    event.preventDefault()
    //Get the artist name from the user input
    var artistName = $("#artist-search").val().trim();
    // call the LASTFM api for al the general artist info
    // Looking for NAME, ALBUMS, SONGS
    var lastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artistName}&api_key=${apikey}&format=json`
    console.log(lastFmUrl);
    fetch(lastFmUrl).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            console.log(data)
        });
        } else {
            alert("Artist not found");
        }
    })
}