const { default: axiosInstance } = require('../http');

export default class TaskService {
  getTasks() {
    return axiosInstance.get('/task/get');
  }

  addTask(data) {
    return axiosInstance.post('/task/add', data);
  }

  editTask(data) {
    return axiosInstance.put(`/task/edit`, data);
  }

  deleteTask(id) {
    return axiosInstance.delete(`/task/delete/${id}`);
  }
}
