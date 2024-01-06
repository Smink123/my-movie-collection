document.addEventListener("DOMContentLoaded", function () {
  const filmNameInput = document.getElementById("filmNameInput");
  const submitSearch = document.getElementById("submitSearch");
  const results = document.getElementById("results");
  const sortingButtons = document.getElementById("sortingButtons");
  const myWatchList = document.getElementById("myWatchList");

  const apiKey = "0db2b210052ac2389b97a0d37eb57c9b";

  submitSearch.addEventListener("click", function () {
    results.textContent = "";
    sortingButtons.textContent = "";
    async function getMovieInfo() {
      const searchTerm = filmNameInput.value.toLowerCase().split(" ").join("+");

      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`;
      try {
        const movieData = await fetch(apiUrl);
        const data = await movieData.json();

        data.results.forEach((film) => {
          const newDate = film.release_date.split("-").reverse().join(".");
          return (film.release_date = newDate);
        });

        data.results.forEach((film) => {
          const year = film.release_date.split(".");
          return (film.release_year = Number(year[2]));
        });

        console.log(data.results);

        //buttons
        const popularOrder = document.createElement("button");
        popularOrder.textContent = "sort by most popular";
        sortingButtons.appendChild(popularOrder);

        const leastPopularOrder = document.createElement("button");
        leastPopularOrder.textContent = "sort by least popular";
        sortingButtons.appendChild(leastPopularOrder);

        const mostRecentRelease = document.createElement("button");
        mostRecentRelease.textContent = "sort by most recent";
        sortingButtons.appendChild(mostRecentRelease);

        const leastRecentRelease = document.createElement("button");
        leastRecentRelease.textContent = "sort by least recent";
        sortingButtons.appendChild(leastRecentRelease);

        /////////////////////////////
        displayMovieInfo(data.results);

        popularOrder.addEventListener("click", function () {
          results.textContent = "";
          const sortedData = [...data.results];
          sortedData.sort((a, b) => b.popularity - a.popularity);
          displayMovieInfo(sortedData);
        });

        leastPopularOrder.addEventListener("click", function () {
          results.textContent = "";
          const sortedData = [...data.results];
          sortedData.sort((a, b) => a.popularity - b.popularity);
          displayMovieInfo(sortedData);
        });

        mostRecentRelease.addEventListener("click", function () {
          results.textContent = "";
          const sortedData = [...data.results];
          sortedData.sort((a, b) => b.release_year - a.release_year);
          displayMovieInfo(sortedData);
        });

        leastRecentRelease.addEventListener("click", function () {
          results.textContent = "";
          const sortedData = [...data.results];
          sortedData.sort((a, b) => a.release_year - b.release_year);
          displayMovieInfo(sortedData);
        });
      } catch (error) {
        console.log(error);
        console.log("could not find film");
      }
    }

    getMovieInfo();
  });
});

const watchList = [];

function displayMovieInfo(apiArray) {
  for (let i = 0; i < apiArray.length; i++) {
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("resultsDiv");
    results.appendChild(resultDiv);

    const filmTitle = document.createElement("p");
    filmTitle.textContent = apiArray[i].title;
    resultDiv.appendChild(filmTitle);

    const filmPoster = document.createElement("img");
    filmPoster.src = `https://image.tmdb.org/t/p/w400${apiArray[i].poster_path}`;
    resultDiv.appendChild(filmPoster);

    const descript = document.createElement("p");
    descript.textContent = apiArray[i].overview;
    if (descript.textContent === "") {
      descript.textContent = "no film description.";
    }
    resultDiv.appendChild(descript);

    const popularityRating = document.createElement("p");
    popularityRating.textContent = apiArray[i].popularity;
    resultDiv.appendChild(popularityRating);

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `release date: ${apiArray[i].release_date}`;
    resultDiv.appendChild(releaseDate);

    const genres = document.createElement("p");
    const allGenre = [];
    allGenre.push(apiArray[i].genre_ids);
    allGenreIds = allGenre.flat(Infinity);
    const genreMappings = {
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    for (let i = 0; i < allGenreIds.length; i++) {
      if (genreMappings.hasOwnProperty(allGenreIds[i])) {
        allGenreIds[i] = genreMappings[allGenreIds[i]];
      } else {
        allGenreIds[i] = "";
      }
    }
    genres.textContent = allGenreIds.join(" ");
    resultDiv.appendChild(genres);

    const addToWatchList = document.createElement("button");
    addToWatchList.textContent = "add to watch list";
    resultDiv.appendChild(addToWatchList);

    const removeFromWatchList = document.createElement("button");
    removeFromWatchList.textContent = "remove from watch list";
    removeFromWatchList.disabled = true;
    resultDiv.appendChild(removeFromWatchList);

    //add film to watchlist
    addToWatchList.addEventListener("click", function () {
      myWatchList.textContent = "";
      removeFromWatchList.disabled = false;
      addToWatchList.disabled = true;
      const filmInfo = {
        filmTitle: apiArray[i].title,
        filmInfo: apiArray[i].overview,
        filmPoster: `https://image.tmdb.org/t/p/w400${apiArray[i].poster_path}`,
      };
//checks if film already exists in array
      const watchListAlreadyContainsFilm = (film) =>
        film.filmTitle === apiArray[i].title &&
        film.filmInfo === apiArray[i].overview;

      if (watchList.some(watchListAlreadyContainsFilm) === false) {
        watchList.push(filmInfo);
      }
      myWatchList.style.whiteSpace = "pre";
      for (let i = 0; i < watchList.length; i++) {
        myWatchList.textContent += `${watchList[i].filmTitle}\n`;
      }
    });
//removes film from watchlist
    removeFromWatchList.addEventListener("click", function () {
      myWatchList.textContent = '';
      addToWatchList.disabled = false;
      removeFromWatchList.disabled = true;
    
      const indexToRemove = watchList.findIndex(film => film.filmTitle === apiArray[i].title && film.filmInfo === apiArray[i].overview);
    
      if (indexToRemove !== -1) { // -1 = no elements match film finder function
        watchList.splice(indexToRemove, 1);
      }
      myWatchList.style.whiteSpace = "pre";
      for (let i = 0; i < watchList.length; i++) {
        myWatchList.textContent += `${watchList[i].filmTitle}\n`;
      }
    });
    
  }
}
