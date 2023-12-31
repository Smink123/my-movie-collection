document.addEventListener("DOMContentLoaded", function () {
  const filmNameInput = document.getElementById("filmNameInput");
  const submitSearch = document.getElementById("submitSearch");
  const results = document.getElementById("results");
  const sortingButtons = document.getElementById("sortingButtons");

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
    const allGenres = apiArray[i].genre_ids.map((genreId) => {
      if (genreId === 28) {
        return "Action";
      } else if (genreId === 12) {
        return "Adventure";
      } else if (genreId === 16) {
        return "Animation";
      } else if (genreId === 35) {
        return "Comedy";
      } else if (genreId === 80) {
        return "Crime";
      } else if (genreId === 99) {
        return "Documentary";
      } else if (genreId === 18) {
        return "Drama";
      } else if (genreId === 10751) {
        return "Family";
      } else if (genreId === 14) {
        return "Fantasy";
      } else if (genreId === 36) {
        return "History";
      } else if (genreId === 27) {
        return "Horror";
      } else if (genreId === 10402) {
        return "Music";
      } else if (genreId === 9648) {
        return "Mystery";
      } else if (genreId === 10749) {
        return "Romance";
      } else if (genreId === 878) {
        return "Science Fiction";
      } else if (genreId === 10770) {
        return "TV Movie";
      } else if (genreId === 53) {
        return "Thriller";
      } else if (genreId === 10752) {
        return "War";
      } else if (genreId === 37) {
        return "Western";
      } else {
        return "Unknown";
      }
    });

    console.log(allGenres);
    genres.textContent = allGenres.join(" ");
    resultDiv.appendChild(genres);
  }
}
