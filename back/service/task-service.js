const db = require('../db');
const path = require('path');
const fs = require('fs');
const { url } = require('inspector');
const ApiErrors = require('../exceptions/api-error');

class TaskService {
  async getTasks(user_id) {
    const tasks = await db.query('SELECT * FROM tasks WHERE user_id = $1', [user_id]);

    const result = [];

    for (const task of tasks.rows) {
      const pictureQuery = await db.query('SELECT * FROM profile_picture WHERE task_id = $1', [
        task.id,
      ]);
      let picture = {};
      // console.log('task', task.id, pictureQuery.rows[0]);
      console.log('check', pictureQuery.rows.length != 0);
      if (pictureQuery.rows.length != 0) {
        console.log('zashel');
        picture = {
          ...pictureQuery.rows[0],
          url: `${process.env.API_URL}/files${pictureQuery.rows[0].file_path}`,
        };
      }
      const attachmentsQuery = await db.query('SELECT * FROM attachments WHERE task_id = $1', [
        task.id,
      ]);

      let attachments = [];

      for (const attachment of attachmentsQuery.rows) {
        let attachmentInc = {
          ...attachment,
          url: `${process.env.API_URL}/files${attachment.rows[0].file_path}`,
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
      throw ApiErrors.NotFound('File not found');
    }
  }

  async addTask(user_id, summary, description, due_date, tasks) {
    let maxOrder = await db.query(
      'SELECT MAX(order_index) FROM tasks WHERE status = 0 AND user_id = $1',
      [user_id],
    );
    maxOrder = maxOrder.rows[0].max + 1;
    const newTask = await db.query(
      'INSERT INTO tasks (user_id, summary, description, due_date, status, order_index) VALUES ($1, $2, $3, $4, 0, $5) RETURNING *',
      [user_id, summary, description, due_date, maxOrder],
    );
    return newTask.rows[0];
  }

  async updateTask(id, summary, description, due_date) {
    if (!id) throw new Error('Id wasn`t sand');
    const updatedTask = await db.query(
      'UPDATE tasks SET summary = $1, description = $2, due_date = $3 WHERE id = $4 RETURNING *',
      [summary, description, due_date, id],
    );
    return updatedTask.rows[0];
  }

  async deleteTask(id) {
    if (!id) throw new Error('Id wasn`t sand');
    const taskData = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!taskData.rows.length) throw new Error('Invalid task id');
    const status = taskData.rows[0].status;
    const orderIndex = taskData.rows[0].order_index;
    const user_id = taskData.rows[0].user_id;
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
