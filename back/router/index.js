const Router = require('express');
const userController = require('../controllers/user-controller');
const taskController = require('../controllers/task-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../middlewares/multer-middleware');

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/task/get', authMiddleware, taskController.getTasks);
router.get('/files/:filePath/:filename', taskController.getFile);
router.post(
  '/task/add',
  authMiddleware,
  upload.fields([
    { name: 'image', maxCount: 2 },
    { name: 'attachments', maxCount: 10 },
  ]),
  taskController.addTask,
);
router.put(
  '/task/update',
  authMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'newAttachments', maxCount: 10 },
  ]),
  taskController.updateTask,
);
router.post('/task/delete', authMiddleware, taskController.deleteTask);
router.post('/task/dndChange', authMiddleware, taskController.dndChange);

module.exports = router;
