document.addEventListener("DOMContentLoaded", function () {
  const filmNameInput = document.getElementById("filmNameInput");
  const submitSearch = document.getElementById("submitSearch");
  const results = document.getElementById("results");

  const apiKey = "0db2b210052ac2389b97a0d37eb57c9b";

  submitSearch.addEventListener("click", function () {
    results.textContent = ''
    async function getMovieInfo() {
      
      const searchTerm = filmNameInput.value.toLowerCase().split(' ').join('+')

      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`;
      try {
        const movieData = await fetch(apiUrl);
        const data = await movieData.json();
        console.log(data.results)

        const popularOrder = document.createElement('button')
        popularOrder.textContent = 'sort by most popular'
        results.appendChild(popularOrder)

        for (let i = 0; i < data.results.length; i++) {
          const resultDiv = document.createElement('div')
          resultDiv.classList.add('resultsDiv')
          results.appendChild(resultDiv);

          const filmTitle = document.createElement('p')
          filmTitle.textContent = data.results[i].title;
          resultDiv.appendChild(filmTitle)

          const filmPoster = document.createElement('img')
          filmPoster.src = `https://image.tmdb.org/t/p/w400${data.results[i].poster_path}`
          resultDiv.appendChild(filmPoster)

          const descript = document.createElement("p");
          descript.textContent = data.results[i].overview;
          if (descript.textContent === '') {
            descript.textContent = 'no film description.'
          }
          resultDiv.appendChild(descript)

          const popularityRating = document.createElement('p')
          popularityRating.textContent = data.results[i].popularity;
          resultDiv.appendChild(popularityRating)
        }

        popularOrder.addEventListener('click', function() {
          results.textContent = ''

          const sortedData = [...data.results];
          sortedData.sort((a, b) => b.popularity - a.popularity);

          for (let i = 0; i < sortedData.length; i++) {
            const resultDiv = document.createElement('div')
            resultDiv.classList.add('resultsDiv')
            results.appendChild(resultDiv);
  
            const filmTitle = document.createElement('p')
            filmTitle.textContent = sortedData[i].title;
            resultDiv.appendChild(filmTitle)
  
            const filmPoster = document.createElement('img')
            filmPoster.src = `https://image.tmdb.org/t/p/w400${sortedData[i].poster_path}`
            resultDiv.appendChild(filmPoster)
  
            const descript = document.createElement("p");
            descript.textContent = sortedData[i].overview;
            if (descript.textContent === '') {
              descript.textContent = 'no film description.'
            }
            resultDiv.appendChild(descript)

            const popularityRating = document.createElement('p')
          popularityRating.textContent = sortedData[i].popularity;
          resultDiv.appendChild(popularityRating)
          }
          
        })



      } catch (error) {
        console.log(error);
        console.log('could not find film')
      }
    }

    getMovieInfo();
  });
});

//https://api.themoviedb.org/3/search/movie?api_key=0db2b210052ac2389b97a0d37eb57c9b&query=the+avengers

//https://image.tmdb.org/t/p/w185/lxM6kqilAdpdhqUl2biYp5frUxE.jpg
