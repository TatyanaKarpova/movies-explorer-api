const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const InternalServerError = require('../errors/internalServerError');
const BadRequestError = require('../errors/badRequestError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => {
      next(new InternalServerError('На сервере произошла ошибка при получении данных о фильмах'));
    });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('По переданному id отсутствуют данные');
      } else if (req.user._id !== movie.owner._id.toString()) {
        next(new ForbiddenError('Недостаточно прав на удаление фильма'));
      } else {
        movie.remove()
          .then(() => res.send({ data: movie }))
          .catch(next);
      }
    })
    .catch(next);
};
