$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    const searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getPosterImage(movie){
  const url = movie.Poster
  return url != 'N/A' ? url : './imgs/NA.jpg';
}

function getMovies(searchText){
  const url = `http://www.omdbapi.com?s=${encodeURIComponent(searchText)}&apikey=${APIKEY}`;
  axios.get(url)
    .then(response => {
      console.log(response);
      const movies = response.data.Search;
      let output = '';
      movies.map(movie => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${getPosterImage(movie)}">
              <h5>${movie.Title}</h5>
              <h5>${movie.Year}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function getMovie(){
  const movieId = sessionStorage.getItem('movieId');
  const url = `http://www.omdbapi.com?i=${movieId}&apikey=${APIKEY}`;
  axios.get(url)
    .then(response => {
      console.log(response);
      const movie = response.data;
      const output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${getPosterImage(movie)}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <br>
        <div class="col-md-12 plot-left">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
        <br><br>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}
