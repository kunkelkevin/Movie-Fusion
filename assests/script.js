var searchBarEl = document.querySelector("#searchBar");
var searchInputEl = document.querySelector("#search");
var multiContainerEl = document.querySelector("#multi-container");
var multiSearchTerm = document.querySelector("#multi-search-term");
var searchResultsEl = document.querySelector("#search-display");
var posterEl = document.querySelector("#poster");
var imgPath = "https://www.themoviedb.org/t/p/w260_and_h390_bestv2";

//hero

var topRated = function () {
  var apiUrl =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=b7854a2f58fc72f2408614bd5147ec1c&language=en-US&page=1";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        for (var i = 0; i < Math.min(5, data.results.length); i++) {
          var cardEl = displayMovie(data.results[i],"movie");
          posterEl.appendChild(cardEl);
        }
        
      });
    } else {
      posterEl.textContent = "We encountered a problem with loading the top rated movies"
    }
  });
};

// An API call based on the search input and display call to show results
var getMultiSearch = function (searchRequest) {
  // format the multi search api url
  var apiUrl =
    "https://api.themoviedb.org/3/search/multi?api_key=b7854a2f58fc72f2408614bd5147ec1c&language=en-US&page=1&query=" +
    searchRequest;
  // make a request to the url
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displaySearch(data, searchRequest);
      });
    } else {
      alert("Error: Search Not Found");
    }
  });
};

// Collects search term and sends to multSearch function
var searchHandler = function (event) {
  event.preventDefault();
  var searchRequest = searchInputEl.value.trim();
  if (searchRequest) {
    getMultiSearch(searchRequest);
    searchInputEl.value = "";
  }
};

// Displays search results (max 5) of movies/tv shows or actors
var displaySearch = function (multi, searchTerm) {
  console.log(multi);
  // check if api returned any multi searches
  multiContainerEl.textContent = "";
  if (multi.results.length === 0) {
    searchResultsEl.textContent = "No Searches found.";
    return;
  }
  searchResultsEl.innerHTML =
    "<h2 class = 'subtitle column is-full'> Showing movies for:  " + searchTerm;
  console.log(multi);
  // loop over search results
  for (var i = 0; i < Math.min(5, multi.results.length); i++) {
    // create a container for each search
    var multiEl = document.createElement("div");
    multiEl.classList = "list-item flex-row justify-space-between align-center";
    // Logic to display appropriate information based on mediatype of movie, TV or actor
    mediaType = multi.results[i].media_type;
    if (mediaType === "person") {
      var cardEl = displayActor(multi.results[i]);
    } else {
      var cardEl = displayMovie(multi.results[i]);
    }
    // append container to the dom
    multiContainerEl.appendChild(cardEl);
  }
};

searchBarEl.addEventListener("submit", searchHandler);
multiContainerEl.addEventListener("click", showSaveHandler);