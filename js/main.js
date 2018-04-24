$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

let pageNumber = 1;

function getMovies(searchText){

  let url = "".concat('http://www.omdbapi.com?s=', searchText,'&apikey=', APIKEY, '&page=', pageNumber);

  axios.get(url)
    .then((response) => {
      console.log(response);
      let movies = response.data.Search;
      let numResults = response.data.totalResults;
      let numResultsDisplay = "Total results found:  " + numResults;
      let display = '';
      $.each(movies, (i, movie) => {
        const imgpath = (movie.Poster != 'N/A') ? movie.Poster : './imgs/NA.jpg';
        display += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${imgpath}">
              <h5>${movie.Title}</h5>
              <h5>${movie.Year}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;
      });

      let pages;

      let pageMore = `<hr>
      <a onclick='pageNumber++; getMovies("${searchText}")' class="btn btn-default">More results</a>
      <br><br><br>`;

      let pagePrior = `<hr>
      <a onclick='pageNumber--; getMovies("${searchText}")' class="btn btn-default">Prior results</a>
      <br><br><br>`;

      let pagePriorAndMore = `<hr>
      <a onclick='pageNumber--; getMovies("${searchText}")' class="btn btn-default">Prior results</a>
      <a onclick='pageNumber++; getMovies("${searchText}")' class="btn btn-default">More results</a>
      <br><br><br>`;

      if ((pageNumber === 1) && (numResults > 10)) {
        pages = pageMore;
      } else if ((pageNumber > 1) && (pageNumber < (numResults / 10))) {
        pages = pagePriorAndMore;
      } else if (numResults > 10) {
        pages = pagePrior;
      }

      $('#resultCount').html(numResultsDisplay);
      $('#movies').html(display);
      $('#paginate').html(pages);
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
  let movieId = sessionStorage.getItem('movieId');
  let url = "".concat('http://www.omdbapi.com?i=', movieId,'&apikey=', APIKEY)

  axios.get(url)
    .then((response) => {
      console.log(response);
      let movie = response.data;
      const imgpath = (movie.Poster != 'N/A') ? movie.Poster : './imgs/NA.jpg';
      let display =`
        <div class="row">
          <div class="col-md-4">
            <img src="${imgpath}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Runtime:</strong> ${movie.Runtime}</li>
            </ul>
          </div>
        </div>
        <br>
        <div class="col-md-12 plot-left">
          <div class="well2">
            <h3>Plot</h3>
            ${movie.Plot}
            <br><br>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
        <br><br>
      `;

      $('#movie').html(display);
    })
    .catch((err) => {
      console.log(err);
    });
}
