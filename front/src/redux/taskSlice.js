import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { login, registration, logout } from './authSlice';
import { data } from '../asset/data.js';
import { setAuth } from './authSlice.js';

const API_URL = 'http://localhost:5000/api/';

const Months = [
  { number: '01', name: 'Jan' },
  { number: '02', name: 'Feb' },
  { number: '03', name: 'Mar' },
  { number: '04', name: 'Apr' },
  { number: '05', name: 'May' },
  { number: '06', name: 'Jun' },
  { number: '07', name: 'Jul' },
  { number: '08', name: 'Aug' },
  { number: '09', name: 'Sep' },
  { number: '10', name: 'Oct' },
  { number: '11', name: 'Nov' },
  { number: '12', name: 'Dec' },
];

export const formatDate = (date) => {
  const splitDate = date.split('-');
  const dayFormatted = splitDate[2].slice(0, 2).replace(/^0/, '');
  const monthFormatted = Months.find((month) => month.number === splitDate[1]).name;
  const formatDate = `${dayFormatted} ${monthFormatted}, ${splitDate[0]}`;
  const newDate = { date: date.split('T')[0], date_format: formatDate };
  return newDate;
};

const initialState = {
  alertList: [{}],
  tasks: [],
  statuses: ['To Do', 'In Progress', 'Done'],
  modal: { isOpen: false, id: null, isCreating: false },
  confirm: { isOpen: false, event: null },
  login: { isOpen: false, tab: null },
  idDraggingComponent: false,
  filteredTasks: data,
  requestStatus: '',
};

export const getTasks = createAsyncThunk('task/get', async (_, { dispatch, rejectWithValue }) => {
  try {
    const res = await axios.get(API_URL + 'task/get', {
      withCredentials: true,
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  } catch (error) {
    dispatch(setAuth());
    return rejectWithValue(error.response?.data);
  }
});

export const addTask = createAsyncThunk(
  'task/create',
  async (payload, { dispatch, rejectWithValue }) => {
    const formatData = new FormData();
    formatData.append('summary', payload.summary);
    formatData.append('description', payload.description);
    formatData.append('due_date', payload.due_date);
    formatData.append('image', payload.image);
    for (const file of payload.attachments) {
      formatData.append('attachments', file);
    }

    try {
      const res = await axios.post(API_URL + 'task/add', formatData, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      // dispatch(setAuth());
      return rejectWithValue(error.response?.data);
    }
  },
);

export const updateTask = createAsyncThunk(
  'task/update',
  async (payload, { dispatch, rejectWithValue }) => {
    const formatData = new FormData();
    formatData.append('id', payload.id);
    formatData.append('summary', payload.summary);
    formatData.append('description', payload.description);
    formatData.append('due_date', payload.due_date);
    formatData.append('image', payload.image);
    for (const file of payload.attachments) {
      formatData.append('attachments', file);
    }
    try {
      const res = await axios.put(API_URL + 'task/update', formatData, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      // dispatch(setAuth());
      return rejectWithValue(error.response?.data);
    }
  },
);

export const deleteTask = createAsyncThunk(
  'task/delete',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        API_URL + 'task/delete',
        { id: payload.id },
        {
          withCredentials: true,
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const dndChange = createAsyncThunk(
  'task/dndChange',
  async (payload, { dispatch, rejectWithValue }) => {
    console.log('payload', payload);
    const resData = {
      changes: payload.map((task) => {
        return { id: task.id, order_index: task.order_index, status: task.status };
      }),
    };

    try {
      const res = await axios.post(API_URL + 'task/dndChange', resData, {
        withCredentials: true,
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal.isOpen = action.payload.isOpen;
      state.modal.id = action.payload.id;
      state.modal.isCreating = action.payload.isCreating;
    },

    setConfirm: (state, action) => {
      state.confirm.isOpen = action.payload.isOpen;

      state.confirm.event = action.payload.event;
    },

    setTasksFilter: (state, action) => {
      state.filteredTasks = state.tasks.filter(
        (task) =>
          task.summery.toLowerCase().includes(action.payload.filter.toLowerCase()) ||
          task.description.toLowerCase().includes(action.payload.filter.toLowerCase()),
      );
    },

    setDndUpdate: (state, action) => {
      state.tasks = action.payload;
    },

    addAlert: (state) => {
      console.log('zashel v addAlert');
      const alertListLength = state.alertList.length;
      state.alertList[alertListLength - 1] = { status: 'error', massage: 'hello world' };
      state.alertList.push({});
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, (state) => {
      state.requestStatus = 'pending';
    });
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.requestStatus = 'success';
      const newData = action.payload.map((task) => {
        task.due_date = formatDate(task.due_date);
        return task;
      });
      console.log('task list', newData);
      state.tasks = newData;
    });
    builder.addCase(getTasks.rejected, (state, action) => {
      state.requestStatus = 'error';
    });

    builder.addCase(addTask.pending, (state) => {
      state.requestStatus = 'pending';
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.requestStatus = 'success';
      const newDate = action.payload.tasks.map((task) => {
        task.due_date = formatDate(task.due_date);
        return task;
      });
      state.tasks = newDate;
    });
    builder.addCase(addTask.rejected, (state, action) => {
      state.requestStatus = 'error';
    });

    builder.addCase(updateTask.pending, (state) => {
      state.requestStatus = 'pending';
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.requestStatus = 'success';
      const newDate = action.payload.tasks.map((task) => {
        task.due_date = formatDate(task.due_date);
        return task;
      });
      state.tasks = newDate;
    });
    builder.addCase(updateTask.rejected, (state) => {
      state.requestStatus = 'error';
    });

    builder.addCase(deleteTask.pending, (state) => {
      state.requestStatus = 'pending';
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.requestStatus = 'success';

      const newDate = action.payload.tasks.map((task) => {
        task.due_date = formatDate(task.due_date);
        return task;
      });
      state.tasks = newDate;
    });
    builder.addCase(deleteTask.rejected, (state) => {
      state.requestStatus = 'error';
    });

    builder.addCase(dndChange.pending, (state) => {
      state.requestStatus = 'pending';
    });
    builder.addCase(dndChange.fulfilled, (state, action) => {
      state.requestStatus = 'success';
      const newDate = action.payload.map((task) => {
        task.due_date = formatDate(task.due_date);
        return task;
      });
      state.tasks = newDate;
    });
    builder.addCase(dndChange.rejected, (state) => {
      state.requestStatus = 'error';
    });

    builder.addCase(login.rejected, (state, action) => {
      console.log(action);
      const alertListLength = state.alertList.length;
      state.alertList[alertListLength - 1] = { status: 'error', massage: action.error.message };
      state.alertList.push({});
    });

    builder.addCase(login.fulfilled, (state, action) => {
      console.log('success login action', action);
      const alertListLength = state.alertList.length;
      state.alertList[alertListLength - 1] = { status: 'success', massage: 'Login was successful' };
      state.alertList.push({});
    });

    builder.addCase(registration.rejected, (state, action) => {
      console.log(action);
      const alertListLength = state.alertList.length;
      state.alertList[alertListLength - 1] = { status: 'error', massage: action.error.message };
      state.alertList.push({});
    });

    builder.addCase(registration.fulfilled, (state, action) => {
      console.log('success login action', action);
      const alertListLength = state.alertList.length;
      state.alertList[alertListLength - 1] = {
        status: 'success',
        massage: 'Registration was successful',
      };
      state.alertList.push({});
    });

    builder.addCase(logout.rejected, (state, action) => {
      console.log(action);
      const alertListLength = state.alertList.length;
      state.alertList[alertListLength - 1] = { status: 'error', massage: action.error.message };
      state.alertList.push({});
    });

    builder.addCase(logout.fulfilled, (state, action) => {
      console.log('success login action', action);
      const alertListLength = state.alertList.length;
      state.alertList[alertListLength - 1] = {
        status: 'success',
        massage: 'Logout was successful',
      };
      state.alertList.push({});
    });
  },
});

export const { setModal, setConfirm, setTasksFilter, setDndUpdate, addAlert } = taskSlice.actions;

export default taskSlice.reducer;
