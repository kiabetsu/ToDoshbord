const TaskService = require('../service/task-service');
const mime = require('mime');

class taskController {
  async getTasks(req, res, next) {
    try {
      const { id } = req.user;
      const tasks = await TaskService.getTasks(id);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async getFile(req, res, next) {
    try {
      const { filePath, filename } = req.params;
      const fileRout = await TaskService.getFile(filePath, filename);
      res.set('Content-Type', mime.lookup(fileRout) || 'application/octet-stream');
      res.sendFile(fileRout);
    } catch (error) {
      next(error);
    }
  }

  async addTask(req, res, next) {
    try {
      const user_id = req.user.id;
      const image = req.files['image']
        ? {
            originalname: req.files['image'][0].originalname,
            savedName: req.files['image'][0].filename,
          }
        : null;
      const attachments = req.files['attachments']
        ? req.files['attachments'].map((file) => {
            return { originalname: file.originalname, savedName: file.filename };
          })
        : [];
      const { summary, description, due_date } = req.body;
      const task = await TaskService.addTask(
        user_id,
        summary,
        description,
        due_date,
        image,
        attachments,
      );

      const tasks = await TaskService.getTasks(user_id);
      return res.json({ tasks: tasks, massage: 'The task was added successfully' });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const user_id = req.user.id;
      const { id, summary, description, due_date, oldAttachments } = req.body;
      const image = req.files['image']
        ? {
            originalname: req.files['image'][0].originalname,
            savedName: req.files['image'][0].filename,
          }
        : null;
      const newAttachments = req.files['newAttachments']
        ? req.files['newAttachments'].map((file) => {
            return { originalname: file.originalname, savedName: file.filename };
          })
        : [];
      const task = await TaskService.updateTask(
        id,
        summary,
        description,
        due_date,
        image,
        oldAttachments,
        newAttachments,
      );

      const tasks = await TaskService.getTasks(user_id);

      return res.json({ tasks: tasks, massage: 'The task was updated successfully' });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const user_id = req.user.id;
      const { id } = req.body;
      const task = await TaskService.deleteTask(id);
      const tasks = await TaskService.getTasks(user_id);

      return res.json({ tasks: tasks, massage: 'The task was deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async dndChange(req, res, next) {
    try {
      const user_id = req.user.id;
      const { changes } = req.body;
      console.log('CHANGESSSSSSS', req.body);
      await TaskService.dndChange(changes);
      const tasks = await TaskService.getTasks(user_id);
      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new taskController();
