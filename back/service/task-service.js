const db = require('../db');

class TaskService {
  async getTasks(user_id) {
    console.log('user_id', user_id);
    const tasks = await db.query('SELECT * FROM tasks WHERE user_id = $1', [user_id]);
    console.log('tasks', tasks.rows);
    return tasks.rows;
  }

  async addTask(user_id, summary, description, due_date) {
    let maxOrder = await db.query('SELECT MAX(order_index) FROM tasks WHERE status = 0');
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
    const deletedTask = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    await db.query(
      `UPDATE tasks SET order_index = order_index - 1 WHERE order_index > ${orderIndex} AND status = ${status}`,
    );
    return deletedTask.rows[0];
  }
}

module.exports = new TaskService();
