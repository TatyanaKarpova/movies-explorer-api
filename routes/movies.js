const router = require('express').Router();
const { createMovieValitator, deleteMovieValidator } = require('../middlewares/validator');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', createMovieValitator, createMovie);
router.delete('/movies/_id', deleteMovieValidator, deleteMovie);

module.exports = router;
