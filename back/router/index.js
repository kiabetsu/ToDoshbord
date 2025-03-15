const Router = require('express');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/task/get', authMiddleware, userController.getTasks);
router.post('/task/add', authMiddleware, userController.addTask);
router.put('/task/update', authMiddleware, userController.updateTask);
router.delete('/task/delete', authMiddleware, userController.deleteTask);
router.post('/task/dndChange', authMiddleware, userController.dndChange);

module.exports = router;
