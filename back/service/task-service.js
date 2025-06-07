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

    return result;
  }

  async getFile(filePath, filename) {
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
    if (attachments.length > 0) {
      for (const attach of attachments) {
        console.log(attach);
        const attachmentInsert = await db.query(
          'INSERT INTO attachments (task_id, file_name, file_path, type, size) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [
            newTask.rows[0].id,
            attach.originalname,
            `/attachments/${attach.savedName}`,
            attach.type,
            attach.size,
          ],
        );
      }
    }

    return newTask.rows[0];
  }

  async updateTask(id, summary, description, due_date, image, oldAttachments, newAttachments) {
    console.log('___OLD ATTACHMENTS___', oldAttachments);
    console.log('___NEW ATTACHMENTS___', newAttachments);

    if (!id) throw new Error('Id wasn`t sand');
    const updatingTask = await db.query(
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

        if (await fs.promises.access(filePath)) await fs.promises.unlink(filePath);
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
    let existingFilesArray = [];
    if (oldAttachments) {
      if (Array.isArray(oldAttachments)) {
        existingFilesArray = oldAttachments.map((file) => JSON.parse(file));
      } else {
        existingFilesArray = [JSON.parse(oldAttachments)];
      }
    }
    if (existingFilesArray && existingFilesArray.length > 0) {
      const attachmentIdsToKeep = existingFilesArray.map((a) => a.attachment_id);

      const attachmentsToDelete = await db.query(
        `SELECT * FROM attachments 
         WHERE task_id = $1 
         AND attachment_id NOT IN (${attachmentIdsToKeep.map((_, i) => `$${i + 2}`).join(',')})`,
        [id, ...attachmentIdsToKeep],
      );

      for (const attachmentNote of attachmentsToDelete.rows) {
        const filePath = path.join(__dirname, '..', 'files', attachmentNote.file_path);
        try {
          await fs.promises.access(filePath);
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }

      await db.query(
        `DELETE FROM attachments 
         WHERE task_id = $1 
         AND attachment_id NOT IN (${attachmentIdsToKeep.map((_, i) => `$${i + 2}`).join(',')})`,
        [id, ...attachmentIdsToKeep],
      );
    }

    // Добавляем новые вложения
    if (newAttachments && newAttachments.length > 0) {
      for (const attach of newAttachments) {
        await db.query(
          'INSERT INTO attachments (task_id, file_name, file_path, type, size) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [id, attach.originalname, `/attachments/${attach.savedName}`, attach.type, attach.size],
        );
      }
    }

    return updatingTask.rows[0];
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

  async dndChange(positionList) {
    for (let position of positionList) {
      await db.query('UPDATE tasks SET status = $1, order_index = $2 WHERE id = $3 ', [
        position.status,
        position.orderIndex,
        position.id,
      ]);
    }
  }
}

module.exports = new TaskService();
