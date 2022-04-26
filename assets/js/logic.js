//LASTFM
var apikey = "f64fb3ab0039c0d8c7bf10bda969375a";
//TICKETMASTER
var tmKey = "dKQgmsljqJ06ivAP6t7T3fm9pOx5TPed";
//var artistSearch = document.getElementById("search-text")

//Past Searches Col element
var pastSearchesEl = document.querySelector(".past-searches")
//Artist Name Col element
var artistInfoEl = document.querySelector(".artist-info");
//Artist Albums Col element
var topAlbumsEl = document.querySelector(".artist-albums");
//Artist Tours Col El
var artistToursEl = document.querySelector(".artist-tours");

//make an array to handle the new searches that happen
var searchedArtists = [];

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
            createButton(data.artist.name)
            getTopAlbums(data.artist.name)
        });
        } else {
            // alert that the artist is not found
            var noArtist = document.createElement("h1")
            noArtist.setAttribute("class", "subtitle is-3")
            noArtist.textContent = "Sorry. We don't seem to have any information on them."
            artistInfoEl.appendChild(noArtist)
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
    name.setAttribute("class", "subtitle is-1 has-text-centered")
    name.textContent = data.artist.name;
    artistInfoEl.appendChild(name);
    
    //generate image of them dynamically
    var artistImg = data.artist.image[2]["#text"]

    var artistImgDisplay = document.createElement("img");
    artistImgDisplay.setAttribute("class", "center-artist")
    artistImgDisplay.setAttribute("src", artistImg)
    artistImgDisplay.setAttribute("alt", "placeholder image of searched artist")
    artistInfoEl.appendChild(artistImgDisplay)
    
    //generate summary info dynamically
    var summary = document.createElement("p")
    summary.setAttribute("class", "has-text-centered")
    // neat trick here to take out the LASTFM hyperlink that they embed into their artist summaries
    summary.textContent = data.artist.bio.summary.split("<a")[0]
    artistInfoEl.appendChild(summary)
}

function getTopAlbums(artistName) {
    var albumFetchUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artistName}&limit=3&api_key=${apikey}&format=json`

    fetch(albumFetchUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                //console.log(data.topalbums)
                displayAlbumInfo(data.topalbums)
            })
        }
        else {
            //alert that albums are not found
            var noAlbum = document.createElement("h1")
            noAlbum.setAttribute("class", "subtitle is-3")
            noAlbum.textContent = "Sorry. We don't seem to have any information on their albums."
            artistInfoEl.appendChild(noAlbum)
        }
    })
    .catch(function(error){
        var apiErrorMsg = document.createElement("h1")
            apiErrorMsg.textContent = 'Sorry, something seems to be wrong with the connection. Check back again soon!'
            topAlbumsEl.appendChild(apiErrorMsg)
    })
}

function displayAlbumInfo(topAlbums) {
    topAlbumsEl.textContent = ''

    var albums = topAlbums.album
    //iterate through the array of albums to get the info we need. 
    for(var i = 0; i < albums.length; i++){
        //create a card for display purposes
        var albumCard = document.createElement("div");
        albumCard.setAttribute("class", "card m-3");

        //get the album name to the screen
        var albumName = document.createElement("h2");
        albumName.setAttribute("class", "card-header-title is-centered");
        albumName.textContent = albums[i].name;
        albumCard.appendChild(albumName);

        //get the album image to the screen
        var albumImg = albums[i].image[2]["#text"]

        var albumImgDisplay = document.createElement("img")
        albumImgDisplay.setAttribute("class", "card-image has-image-centered p-2")
        albumImgDisplay.setAttribute("src", albumImg)
        albumImgDisplay.setAttribute("alt", "placeholder image of searched artist album")
        albumCard.appendChild(albumImgDisplay);

        topAlbumsEl.appendChild(albumCard);
    }
}

function getTourInfo(artist) {
    var ticketmasterUrl = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${artist}&apikey=${tmKey}`

    fetch(ticketmasterUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayTourInfo(data, artist)
            })
        }
        else {
            //alert there are no tickets related to the searched artist
            var noTickets = document.createElement("h1")
            noTickets.setAttribute("class", "subtitle is-3")
            noTickets.textContent = "Sorry. There doesn't seem to be any events with this artist."
            artistInfoEl.appendChild(noATickets)
        }
    })
    .catch(function(error){
        var apiErrorMsg = document.createElement("h1")
            apiErrorMsg.textContent = 'Sorry, something seems to be wrong with the connection. Check back again soon!'
            topAlbumsEl.appendChild(apiErrorMsg)
    })
}

function displayTourInfo(data, artist) {
    artistToursEl.textContent = ''

    var name = data._embedded.attractions[0].name
    var tourLink = data._embedded.attractions[0].url

    if(name === artist){
        var tourInfo = document.createElement("h1")
        tourInfo.textContent = "Want to experience " + name + " live?"
        artistToursEl.appendChild(tourInfo)

        var tourHyperLink = document.createElement("p")
        tourHyperLink.innerHTML = "Click the link <a href='" + tourLink + "'> HERE</a> to see if they're coming to a town near you!"
        artistToursEl.appendChild(tourHyperLink)
    }
    else {
        var noTours = document.createElement("h1");
        noTours.textContent = "Sorry. This artist doesn't seem to have any events coming up."
        artistToursEl.appendChild(noTours)
    }
}

function createButton(artist) {
    //let's create buttons to search for past artists
    var recentSearches = document.createElement("button")
    recentSearches.setAttribute("class", "button is-dark are-large")
    recentSearches.setAttribute("id", "history")
    recentSearches.textContent = artist

    //Ensure that no one artist is searched up more than once.
    if(!searchedArtists.includes(recentSearches.textContent)){
        searchedArtists.push(recentSearches.textContent)
        pastSearchesEl.appendChild(recentSearches);
        saveSearch()
    }
}

function saveSearch() {
    localStorage.setItem("artists", JSON.stringify(searchedArtists));
}

function loadSearch() {
    var searchHistory = localStorage.getItem("artists");

    if(!searchHistory){
        return false;
    }
    else {
        searchHistory = JSON.parse(searchHistory)
        for(var i = 0; i < searchHistory.length; i++){
            createButton(searchHistory[i])
        }
    }
}

$("#search-btn").on("click", formHandler)

$(".past-searches").on("click", "button", function() {
    var priorSearch = $(this).text()
    getArtistInfo(priorSearch)
    getTourInfo(priorSearch)
})

loadSearch();