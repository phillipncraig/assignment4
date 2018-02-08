const express = require('express');
const app = express();
const port = process.argv[2] || 8080
const bodyParser = require('body-parser')

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
    return movie.movieId === userMovieId
    })

    res.render('movie', {  
    movie,  // to add more of the object content, include in the movie.ejs outputs (movie.date for example)
    

  })
  
})

app.listen(port, () => {
  console.log(port)
})

function getMovies() {
  return [{
    movieId: 'blade-runner',
    title: 'Blade Runner',
    year: '1982',
    rated: 'R',
    released: '25 June 1982',
    runtime: '1h 57min',
    genre: 'Sci-Fi, Thriller',
    director: 'Ridley Scott',
    writer: 'Hampton Fancher, David Peoples',
    actors: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos',
    plot: 'A blade runner must pursue and try to terminate four replicants who stole a ship in space and have returned to Earth to find their creator.',
    language: 'English',
    country: 'USA, Hong Kong'
  }, {
    movieId: 'star-wars',
    title: 'Star Wars',
    year: '1980',
    rated: 'R',
    released: '14 Nov 1980',
    runtime: '1h 20min',
    genre: 'Sci-Fi, Thriller',
    director: 'George Lucas',
    writer: 'Who Knows, Nobody Cares',
    actors: 'Harrison Ford, Carrie Fischer, Someone Else',
    plot: 'Da da daaaa DAAAAA da da da DAAAAAAA da, dada da DAAAA da dadada daaaaa.',
    language: 'English',
    country: 'USA, Tattooine'
  }]
}