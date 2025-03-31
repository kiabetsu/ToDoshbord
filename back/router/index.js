const Router = require('express');
const userController = require('../controllers/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const multerMiddleware = require('../middlewares/multer-middleware');

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/task/get', authMiddleware, userController.getTasks);
router.get('/files/:filePath/:filename', userController.getFile);
router.post(
  '/task/add',
  authMiddleware,
  // multerMiddleware.array('attaches'),
  // multerMiddleware.array('picture'),
  userController.addTask,
);
router.put(
  '/task/update',
  authMiddleware,
  // multerMiddleware.array('attaches'),
  // multerMiddleware.array('picture'),
  userController.updateTask,
);
router.delete('/task/delete', authMiddleware, userController.deleteTask);
router.post('/task/dndChange', authMiddleware, userController.dndChange);

module.exports = router;
