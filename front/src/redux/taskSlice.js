import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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
  tasks: [],
  statuses: ['To Do', 'In Progress', 'Done'],
  modal: { isOpen: false, id: null, isCreating: false },
  alert: { isOpen: false, event: null },
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
    console.log('getTasks', res);
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
      console.log(file);
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
      dispatch(getTasks());
      return res.data;
    } catch (error) {
      console.log('addTaskERROR', error);
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
      dispatch(getTasks());
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
      console.log('payload', payload.id);
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
      dispatch(getTasks());
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

    setAlert: (state, action) => {
      state.alert.isOpen = action.payload.isOpen;

      state.alert.event = action.payload.event;
    },

    setLogin(state, action) {
      state.login.isOpen = action.payload.isOpen;
      state.login.tab = action.payload.tab;
    },

    setData: (state, action) => {
      const indexOfElement = state.tasks.indexOf(
        state.tasks.find((task) => task.id === action.payload.id),
      );
      if (state.tasks[indexOfElement].image !== action.payload.pic) {
        state.tasks[indexOfElement].image = action.payload.pic;
      }
      if (state.tasks[indexOfElement].summary !== action.payload.summary) {
        state.tasks[indexOfElement].summary = action.payload.summary;
      }
      if (state.tasks[indexOfElement].description !== action.payload.description) {
        state.tasks[indexOfElement].description = action.payload.description;
      }
      if (state.tasks[indexOfElement].due_date.date !== action.payload.due_date) {
        state.tasks[indexOfElement].due_date = formatDate(action.payload.due_date);
      }
      if (state.tasks[indexOfElement].attachments !== action.payload.attachments) {
        state.tasks[indexOfElement].attachments = action.payload.attachments;
      }
    },

    // createTask: (state, action) => {
    //   const newTask = {};
    //   newTask['id'] = state.tasks[state.tasks.length - 1].id + 1;
    //   newTask['status'] = 0;
    //   newTask['image'] = action.payload.pic;
    //   newTask['summary'] = action.payload.summary;
    //   newTask['description'] = action.payload.description;
    //   newTask['due_date'] = formatDate(action.payload.due_date);
    //   newTask['attachments'] = action.payload.attachments;

    //   state.tasks.push(newTask);
    // },

    setRemoveTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    },

    setTasksFilter: (state, action) => {
      state.filteredTasks = state.tasks.filter(
        (task) =>
          task.summery.toLowerCase().includes(action.payload.filter.toLowerCase()) ||
          task.description.toLowerCase().includes(action.payload.filter.toLowerCase()),
      );
    },

    setDataTextContent: (state, action) => {
      const id = state.tasks.indexOf(state.tasks.find((task) => task.id === action.payload.id));
      // state.TESTOUTPUT = id;

      state.tasks[id][action.payload.key] = action.payload.value;
    },

    setStatus: (state, action) => {
      const id = state.tasks.indexOf(state.tasks.find((task) => task.id === action.payload.id));
      state.tasks[id].status = action.payload.status;
    },

    setDndUpdate: (state, action) => {
      state.tasks = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, (state) => {
      state.requestStatus = 'pending';
    });

    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.requestStatus = 'success';
      const newDate = action.payload.map((task) => {
        task.due_date = formatDate(task.due_date);
        return task;
      });

      state.tasks = newDate;
    });

    builder.addCase(getTasks.rejected, (state, action) => {
      state.requestStatus = 'error';
    });

    builder.addCase(addTask.pending, (state) => {
      state.requestStatus = 'pending';
    });

    builder.addCase(addTask.fulfilled, (state, action) => {
      state.requestStatus = 'success';
    });

    builder.addCase(addTask.rejected, (state, action) => {
      state.requestStatus = 'error';
    });

    builder.addCase(updateTask.pending, (state) => {
      state.requestStatus = 'pending';
    });
    builder.addCase(updateTask.fulfilled, (state) => {
      state.requestStatus = 'success';
    });
    builder.addCase(updateTask.rejected, (state) => {
      state.requestStatus = 'error';
    });

    builder.addCase(deleteTask.pending, (state) => {
      state.requestStatus = 'pending';
    });
    builder.addCase(deleteTask.fulfilled, (state) => {
      state.requestStatus = 'success';
    });
    builder.addCase(deleteTask.rejected, (state) => {
      state.requestStatus = 'error';
    });
  },
});

export const {
  setModal,
  setAlert,
  setLogin,
  setData,
  setDueDate,
  setDataTextContent,
  setStatus,
  setIdDraggingComponent,
  setOrderIndex,
  setUploadAttachment,
  setRemoveAttachment,
  // createTask,
  setRemoveTask,
  setTasksFilter,
  setDndUpdate,
} = taskSlice.actions;

export default taskSlice.reducer;
