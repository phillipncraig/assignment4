const express = require('express');
const app = express();
const request = require('request');
const fs = require('fs')
const port = process.argv[2] || 8080
const bodyParser = require('body-parser')
let obj = []
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index', { movies: getMovies() });
});

app.get('/movie/:movieId', (req, res) => {
  let userMovieId = req.params.movieId // this is simply so I'm using more explicit tags to help me understand user input versus array object of movieId
  let movie = getMovies().find((movie) => { //using find rather than filter so that I don't have to work with an array index for the movie output
    return movie.title === userMovieId
  })
  res.render('movie', {
    movie,  // to add more of the object content, include in the movie.ejs outputs (movie.date for example)
  })
})

app.get('/search', (req, res, next) => {
  let { searchTerm } = req.query
  let movie = getMovies().find((movie) => {
    if (movie.title.toLowerCase() === searchTerm.toLowerCase()) {
      res.render('movie', {
        movie
      })
    } 
  })
  //res.send('Sorry, don\'t have that movie!')
  res.render('404', {});

})

fs.readFile('avengersMDB.txt', 'utf8', function (err, content) {
  if (err) {
    console.log('err')
  }
  obj = JSON.parse(content)
})

app.get('*', function (req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

// handling 404 errors
app.use(function (err, req, res, next) {
  if (err.status !== 404) {
    return next();
  }
  res.render('404', {});
});

app.listen(port, () => {
  console.log(port)
})

getOptions()


// getting avenger movie data via TMDB database (> string write to avengersMDB > parse read from file and call into getMovies as array)

function getOptions() {
  let options = {
    method: 'GET',
    url: `https://api.themoviedb.org/4/list/1`, //change the /1 to other integers to access new lists
    qs: { api_key: '32abd1b72bebf2a07f4490687c38e699', page: '1' },
    headers:
      {
        authorization: 'Bearer <<access_token>>',
        'content-type': 'application/json;charset=utf-8'
      },
    body: {},
    json: true
  }

  request(options, function (error, response, body) {
    if (error) throw new Error(error)
    fs.writeFile('avengersMDB.txt', JSON.stringify(body.results), function (err) {
      if (err) {
        console.log('err')
      }
    })
  })
}

function getMovies() {
  return obj
}

//   return [{
//     movieId: 'blade-runner',
//     title: 'Blade Runner',
//     year: '1982',
//     rated: 'R',
//     released: '25 June 1982',
//     runtime: '1h 57min',
//     genre: 'Sci-Fi, Thriller',
//     director: 'Ridley Scott',
//     writer: 'Hampton Fancher, David Peoples',
//     actors: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos',
//     plot: 'A blade runner must pursue and try to terminate four replicants who stole a ship in space and have returned to Earth to find their creator.',
//     language: 'English',
//     country: 'USA, Hong Kong'
//   }, {
//     movieId: 'star-wars',
//     title: 'Star Wars',
//     year: '1980',
//     rated: 'R',
//     released: '14 Nov 1980',
//     runtime: '1h 20min',
//     genre: 'Sci-Fi, Thriller',
//     director: 'George Lucas',
//     writer: 'Who Knows, Nobody Cares',
//     actors: 'Harrison Ford, Carrie Fischer, Someone Else',
//     plot: 'Da da daaaa DAAAAA da da da DAAAAAAA da, dada da DAAAA da dadada daaaaa.',
//     language: 'English',
//     country: 'USA, Tattooine'
//   }]
// }