const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const InternalServerError = require('../errors/internalServerError');
const BadRequestError = require('../errors/badRequestError');
const {
  createdCode,
  successCode,
  internalServerErrorMessage,
  movieNotFoundErrorMessage,
  validationBadRequestErrorMessage,
  movieDeleteForbiddenErrorMessage,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(() => new NotFoundError(movieNotFoundErrorMessage))
    .then((movies) => res.status(successCode).send(movies))
    .catch(() => {
      next(new InternalServerError(internalServerErrorMessage));
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
    .then((movie) => res.status(createdCode).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(validationBadRequestErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFoundErrorMessage);
      } else if (req.user._id !== movie.owner._id.toString()) {
        next(new ForbiddenError(movieDeleteForbiddenErrorMessage));
      } else {
        movie.remove()
          .then(() => res.status(successCode).send({ data: movie }))
          .catch(next);
      }
    })
    .catch(next);
};
