//LASTFM
var apikey = "f64fb3ab0039c0d8c7bf10bda969375a"
//TICKETMASTER
var tmKey = "dKQgmsljqJ06ivAP6t7T3fm9pOx5TPed"
//var artistSearch = document.getElementById("search-text")

//Artist Name Col element
var artistInfoEl = document.querySelector(".artist-info")
//Artist Albums Col element
var topAlbumsEl = document.querySelector(".artist-albums")
//Artist Tours Col El
var artistToursEl = document.querySelector(".artist-tours")

//ensures that the user entered something into the search field
var formHandler = function(event) {
  //prevents the page from refreshing on submit
  event.preventDefault();
  var artistName = $("#artist-search").val().trim();

  if (artistName) {
    $("#artist-search").val('');
    getArtistInfo(artistName);
    getTourInfo(artistName);
  }
  else {
    alert("Please enter an artist name");
  }
}

//gets inputed artist info
function getArtistInfo(artist) {
    // ensure the page doesn't auto-refresh with every search
    event.preventDefault()
    // call the LASTFM api for al the general artist info
    var lastFmUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${artist}&api_key=${apikey}&format=json`
    fetch(lastFmUrl).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            displayArtistInfo(data)
            getTopAlbums(data.artist.name)
        });
        } else {
            // alert that the artist is not found
        }
    })
    .catch(function(error){
        var apiErrorMsg = document.createElement("h1")
            apiErrorMsg.textContent = 'Sorry, something seems to be wrong with the connection. Check back again soon!'
            topAlbumsEl.appendChild(apiErrorMsg)
    })
}

function displayArtistInfo(data) {
    artistInfoEl.textContent = ''

    //create name display dynamically dynamically
    var name = document.createElement("h2")
    name.textContent = data.artist.name;
    artistInfoEl.appendChild(name);
    
    //generate image of them dynamically
    var artistImg = data.artist.image[2]["#text"]

    var artistImgDisplay = document.createElement("img");
    artistImgDisplay.setAttribute("src", artistImg)
    artistImgDisplay.setAttribute("alt", "placeholder image of searched artist")
    artistInfoEl.appendChild(artistImgDisplay)
    
    //generate summary info dynamically
    var summary = document.createElement("p")
    summary.textContent = data.artist.bio.summary
    artistInfoEl.appendChild(summary)
    //console.log(summary)
}

function getTopAlbums(artistName) {
    var albumFetchUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}&limit=3&api_key=${apikey}&format=json`

    fetch(albumFetchUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //console.log(data.topalbums)
                displayAlbumInfo(data.topalbums)
            })
        }
        else {
            //alert that albums are not found
        }
    })
    .catch(function(error){
        var apiErrorMsg = document.createElement("h1")
            apiErrorMsg.textContent = 'Sorry, something seems to be wrong with the connection. Check back again soon!'
            topAlbumsEl.appendChild(apiErrorMsg)
    })
}

function displayAlbumInfo(topAlbums) {
    console.log(topAlbums)

    topAlbumsEl.textContent = ''

    var albums = topAlbums.album
    //iterate through the array of albums to get the info we need. 
    for(var i = 0; i < albums.length; i++){
        //get the album name to the screen
        var albumName = document.createElement("h2")
        albumName.textContent = albums[i].name
        topAlbumsEl.appendChild(albumName);

        //get the album image to the screen
        var albumImg = albums[i].image[3]["#text"]

        var albumImgDisplay = document.createElement("img")
        albumImgDisplay.setAttribute("src", albumImg)
        albumImgDisplay.setAttribute("alt", "placeholder image of searched artist album")
        topAlbumsEl.appendChild(albumImgDisplay)
    }
}

function getTourInfo(artist) {
    var ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=${tmKey}`

    fetch(ticketmasterUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayTourInfo(data)
            })
        }
        else {
            //alert there are no tickets related to the searched artist
        }
    })
    .catch(function(error){
        var apiErrorMsg = document.createElement("h1")
            apiErrorMsg.textContent = 'Sorry, something seems to be wrong with the connection. Check back again soon!'
            topAlbumsEl.appendChild(apiErrorMsg)
    })
}

function displayTourInfo(data) {
    artistToursEl.textContent = ''

    var name = data._embedded.attractions[0].name
    var tourLink = data._embedded.attractions[0].url

    var tourInfo = document.createElement("h1")
    tourInfo.textContent = "Want to experience " + name + " live?"
    artistToursEl.appendChild(tourInfo)

    var tourHyperLink = document.createElement("p")
    tourHyperLink.innerHTML = "Click the link <a href='" + tourLink + "'> HERE</a> to see if they're coming to a town near you!"
    artistToursEl.appendChild(tourHyperLink)
    

}

$("#search-btn").on("click", formHandler)
    
