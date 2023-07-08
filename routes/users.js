const router = require('express').Router();
const { updateUserValidator } = require('../middlewares/validator');
const { getUser, updateUser } = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', updateUserValidator, updateUser);

module.exports = router;
