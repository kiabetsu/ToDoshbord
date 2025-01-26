import { createSlice } from '@reduxjs/toolkit';

import { data } from '../asset/data.js';

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

const formatDate = (date) => {
  const splitDate = date.split('-');
  const monthFormatted = Months.find((month) => month.number === splitDate[1]).name;
  const formatDate = `${splitDate[2]} ${monthFormatted}, ${splitDate[0]}`;
  const newDate = { date: date, date_format: formatDate };
  return newDate;
};

const initialState = {
  tasks: data,
  statuses: ['To Do', 'In Progress', 'Done'],
  modal: { isOpen: false, id: null, isCreating: false },
  alert: { isOpen: false, event: null },
  login: { isOpen: false, tab: null },
  idDraggingComponent: false,
  filteredTasks: data,
};

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

    createTask: (state, action) => {
      const newTask = {};
      newTask['id'] = state.tasks[state.tasks.length - 1].id + 1;
      newTask['status'] = 0;
      newTask['image'] = action.payload.pic;
      newTask['summary'] = action.payload.summary;
      newTask['description'] = action.payload.description;
      newTask['due_date'] = formatDate(action.payload.due_date);
      newTask['attachments'] = action.payload.attachments;

      state.tasks.push(newTask);
    },

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
  createTask,
  setRemoveTask,
  setTasksFilter,
  setDndUpdate,
} = taskSlice.actions;

export default taskSlice.reducer;
