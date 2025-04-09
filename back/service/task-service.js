const db = require('../db');
const path = require('path');
const fs = require('fs');
const { url } = require('inspector');
const ApiErrors = require('../exceptions/api-error');
const iconv = require('iconv-lite');

class TaskService {
  async getTasks(user_id) {
    const tasks = await db.query('SELECT * FROM tasks WHERE user_id = $1', [user_id]);

    const result = [];

    for (const task of tasks.rows) {
      const pictureQuery = await db.query('SELECT * FROM profile_picture WHERE task_id = $1', [
        task.id,
      ]);
      let picture = {};

      console.log('check', pictureQuery.rows.length != 0);
      if (pictureQuery.rows.length != 0) {
        picture = {
          ...pictureQuery.rows[0],
          url: `${process.env.API_URL}/api/files${pictureQuery.rows[0].file_path}`,
        };
      }
      const attachmentsQuery = await db.query('SELECT * FROM attachments WHERE task_id = $1', [
        task.id,
      ]);

      let attachments = [];

      for (const attachment of attachmentsQuery.rows) {
        let attachmentInc = {
          ...attachment,
          url: `${process.env.API_URL}/api/files${attachment.file_path}`,
        };
        attachments.push(attachmentInc);
      }

      result.push({
        ...task,
        picture: picture,
        attachments: attachments,
      });
    }

    // console.log('RESULT', result);

    return result;
  }

  async getFile(filePath, filename) {
    console.log(filePath, filename);
    const fileRout = path.join(__dirname, '..', 'files', filePath, filename);
    try {
      const data = await fs.promises.readFile(fileRout);
      return fileRout;
    } catch (err) {
      throw ApiErrors.NotFound(`File '${filename}' not found`);
    }
  }

  async addTask(user_id, summary, description, due_date, image, attachments) {
    let maxOrder = await db.query(
      'SELECT MAX(order_index) FROM tasks WHERE status = 0 AND user_id = $1',
      [user_id],
    );
    maxOrder = maxOrder.rows[0].max + 1;
    const newTask = await db.query(
      'INSERT INTO tasks (user_id, summary, description, due_date, status, order_index) VALUES ($1, $2, $3, $4, 0, $5) RETURNING *',
      [user_id, summary, description, due_date, maxOrder],
    );
    if (image) {
      const imageInsert = await db.query(
        'INSERT INTO profile_picture (task_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING *',
        [newTask.rows[0].id, image.originalname, `/taskPictures/${image.savedName}`],
      );
    }
    console.log(attachments);
    if (attachments.length > 0) {
      for (const attach of attachments) {
        const attachmentInsert = await db.query(
          'INSERT INTO attachments (task_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING *',
          [newTask.rows[0].id, attach.originalname, `/attachments/${attach.savedName}`],
        );
      }
    }

    return newTask.rows[0];
  }

  async updateTask(id, summary, description, due_date, image, attachments) {
    if (!id) throw new Error('Id wasn`t sand');
    const updatedTask = await db.query(
      'UPDATE tasks SET summary = $1, description = $2, due_date = $3 WHERE id = $4 RETURNING *',
      [summary, description, due_date, id],
    );

    //update task image
    if (image) {
      const chooseOldImage = await db.query('SELECT * FROM profile_picture where task_id = $1 ', [
        id,
      ]);

      if (chooseOldImage.rows.length) {
        const filePath = path.join(__dirname, '..', 'files', chooseOldImage.rows[0].file_path);

        try {
          await fs.promises.access(filePath);
        } catch {
          throw new Error('File not found');
        }
        await fs.promises.unlink(filePath);
      }

      const deleteOldImage = await db.query(
        'DELETE FROM profile_picture WHERE task_id = $1 RETURNING *',
        [id],
      );
      const imageInsert = await db.query(
        'INSERT INTO profile_picture (task_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING *',
        [id, image.originalname, `/taskPictures/${image.savedName}`],
      );
    }

    //update task attachments
    const chooseOldAttachments = await db.query('SELECT * FROM attachments WHERE task_id = $1', [
      id,
    ]);
    if (chooseOldAttachments.rows.length) {
      for (const attachmentNote of chooseOldAttachments.rows) {
        const filePath = path.join(__dirname, '..', 'files', attachmentNote.file_path);
        try {
          await fs.promises.access(filePath);
        } catch {
          return res.status(404).json({ error: 'File not found' });
        }
        await fs.promises.unlink(filePath);
      }
    }

    const deleteOldAttachments = await db.query('DELETE FROM attachments WHERE task_id = $1', [id]);
    if (attachments.length > 0) {
      for (const attach of attachments) {
        const attachmentInsert = await db.query(
          'INSERT INTO attachments (task_id, file_name, file_path) VALUES ($1, $2, $3) RETURNING *',
          [id, attach.originalname, `/attachments/${attach.savedName}`],
        );
      }
    }
    return updatedTask.rows[0];
  }

  async deleteTask(id) {
    if (!id) throw new Error('Id wasn`t sand');
    const taskData = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!taskData.rows.length) throw new Error('Invalid task id');
    const status = taskData.rows[0].status;
    const orderIndex = taskData.rows[0].order_index;
    const user_id = taskData.rows[0].user_id;

    //delete files
    //delete task image
    const chooseOldImage = await db.query('SELECT * FROM profile_picture where task_id = $1 ', [
      id,
    ]);
    if (chooseOldImage.rows.length) {
      const filePath = path.join(__dirname, '..', 'files', chooseOldImage.rows[0].file_path);

      try {
        await fs.promises.access(filePath);
      } catch {
        return res.status(404).json({ error: 'File not found' });
      }
      await fs.promises.unlink(filePath);
    }

    //delete task attachments
    const chooseOldAttachments = await db.query('SELECT * FROM attachments WHERE task_id = $1 ', [
      id,
    ]);
    if (chooseOldAttachments.rows.length) {
      for (const attachmentNote of chooseOldAttachments.rows) {
        const filePath = path.join(__dirname, '..', 'files', attachmentNote.file_path);
        try {
          await fs.promises.access(filePath);
        } catch {
          return res.status(404).json({ error: 'File not found' });
        }
        await fs.promises.unlink(filePath);
      }
    }

    const deletedTask = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    await db.query(
      `UPDATE tasks SET order_index = order_index - 1 WHERE order_index > $1 AND status = $2 AND user_id = $3`,
      [orderIndex, status, user_id],
    );
    return deletedTask.rows[0];
  }

  async dndChange(changeData) {
    const tasks_id = Object.keys(changeData);
    for (let id of tasks_id) {
      const orderIndex = changeData[id].order_index;
      const status = changeData[id].status;
      await db.query('UPDATE tasks SET status = $1, order_index = $2 WHERE id = $3 ', [
        status,
        orderIndex,
        id,
      ]);
    }
  }
}

console.log('dirname', path.join(__dirname, '../asset'));
console.log('check', fs.existsSync(path.join(__dirname, '../asset')));

module.exports = new TaskService();
