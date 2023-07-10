const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  successCode,
  createdCode,
  validationBadRequestErrorMessage,
  internalServerErrorMessage,
  userIdNotFoundErrorMessage,
  userDataBadRequestErrorMessage,
  userEmailConflictErrorMessage,
  userDataUnauthorizedErrorMessage,
} = require('../utils/constants');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const InternalServerError = require('../errors/internalServerError');
const NotFoundError = require('../errors/notFoundError');
const UnauthorizedError = require('../errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.status(createdCode).send({
          data: {
            name, email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError(validationBadRequestErrorMessage));
          } else if (err.code === 11000) {
            next(new ConflictError(userEmailConflictErrorMessage));
          }
          next(new InternalServerError(internalServerErrorMessage));
        });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFoundError(userIdNotFoundErrorMessage); })
    .then((user) => res.status(successCode).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(userDataBadRequestErrorMessage));
      } else {
        next(new InternalServerError(internalServerErrorMessage));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundError(userIdNotFoundErrorMessage); })
    .then((user) => res.status(successCode).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(userDataBadRequestErrorMessage));
      } else if (err.code === 11000) {
        next(new ConflictError(userEmailConflictErrorMessage));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000 * 24 * 7,
        })
        .send({ jwt: token });
    })
    .catch(() => {
      next(new UnauthorizedError(userDataUnauthorizedErrorMessage));
    });
};
