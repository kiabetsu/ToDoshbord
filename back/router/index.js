const Router = require('express');
const userController = require('../controllers/user-controller');

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/tasks', userController.getTasks);
router.post('/refresh', userController.refresh);

module.exports = router;
