const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { successCode } = require('../utils/constants');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const InternalServerError = require('../errors/internalServerError');
const NotFoundError = require('../errors/notFoundError');

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
        .then(() => res.status(successCode).send({
          data: {
            name, email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные при создании нового пользователя'));
          } else if (err.code === 11000) {
            next(new ConflictError('Пользователь с такими e-mail уже существует'));
          }
          next(new InternalServerError('На сервере произошла ошибка при создании нового пользователя'));
        });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { throw new NotFoundError('По переданному id отсутствуют данные'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при получении данных о пользователе'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка при получении данных о пользователе'));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundError('По переданному id отсутствуют данные'); })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
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
    .catch((err) => {
      next(err);
    });
};
