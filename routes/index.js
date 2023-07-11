const router = require('express').Router();
const { signUpUserValidator, signInUserValidator } = require('../middlewares/validator');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const NotFoundError = require('../errors/notFoundError');
const { pageNotFoundErrorMessage } = require('../utils/constants');

router.post('/signin', signInUserValidator, login);
router.post('/signup', signUpUserValidator, createUser);

router.use(auth);

router.use('/', usersRoutes, moviesRoutes);

router.use('*', () => {
  throw new NotFoundError(pageNotFoundErrorMessage);
});

module.exports = router;
