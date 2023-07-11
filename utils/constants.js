module.exports.successCode = 200;
module.exports.createdCode = 201;

module.exports.regex = /https?:\/\/(www)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]*/i;

module.exports.allowedCors = [
  'https://movies.explorer.16.nomoredomains.work',
  'http://movies.explorer.16.nomoredomains.work',
  'http://localhost:3000',
  'http://localhost:3001',
];

module.exports.DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports.crashTestErrorMessage = 'Сервер сейчас упадёт';
module.exports.internalServerErrorMessage = 'На сервере произошла ошибка';
module.exports.movieNotFoundErrorMessage = 'Фильм не найден';
module.exports.validationBadRequestErrorMessage = 'Ошибка валидации';
module.exports.movieDeleteForbiddenErrorMessage = 'Вы не можете удалять фильмы других пользователей';
module.exports.userEmailConflictErrorMessage = 'Пользователь с такими e-mail уже существует';
module.exports.userIdNotFoundErrorMessage = 'Пользователя с таким id не существует';
module.exports.userDataBadRequestErrorMessage = 'Переданы некорректные данные';
module.exports.userDataUnauthorizedErrorMessage = 'При авторизации переданы некорректные почта или пароль';
module.exports.unauthorizedErrorMessage = 'Необходима авторизация';
module.exports.incorrectUrlFormatErrorMessage = 'Некорректный формат ссылки';
module.exports.incorrectEmailFormatErrorMessage = 'Некорректный формат почты';
module.exports.pageNotFoundErrorMessage = 'Страница не найдена';
