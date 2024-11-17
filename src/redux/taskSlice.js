import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { data, newData } from '../asset/data.js';

const getDate = (date) => {
  return `${date.getDate(date)}.${date.getMonth(date) + 1}.${date.getFullYear(
    date,
  )} ${date.getHours(date)}:${date.getMinutes(date)}`;
};

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
  idDraggingComponent: false,
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

    setData: (state, action) => {
      const indexOfElement = state.tasks.indexOf(
        state.tasks.find((task) => task.id === action.payload.id),
      );
      if (state.tasks[indexOfElement].image !== action.payload.pic) {
        state.tasks[indexOfElement].image = action.payload.pic;
      }
      if (state.tasks[indexOfElement].summery !== action.payload.summery) {
        state.tasks[indexOfElement].summery = action.payload.summery;
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
      newTask['summery'] = action.payload.summery;
      newTask['description'] = action.payload.description;
      newTask['due_date'] = formatDate(action.payload.due_date);
      newTask['attachments'] = action.payload.attachments;
      state.tasks.push(newTask);
    },

    setRemoveTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
    },

    setTasksFilter: (state, action) => {},

    setDueDate: (state, action) => {
      const id = state.tasks.indexOf(state.tasks.find((task) => task.id === action.payload.id));
      state.tasks[id].due_date.date = action.payload.value;
    },

    setDataTextContent: (state, action) => {
      console.log(state.tasks);
      const id = state.tasks.indexOf(state.tasks.find((task) => task.id === action.payload.id));
      // state.TESTOUTPUT = id;

      state.tasks[id][action.payload.key] = action.payload.value;
    },

    setStatus: (state, action) => {
      const id = state.tasks.indexOf(state.tasks.find((task) => task.id === action.payload.id));
      state.tasks[id].status = action.payload.status;
    },

    // setOrderIndex: (state, action) => {
    //   const serialize = JSON.stringify(action.payload);
    //   console.log('serialiatsia', serialize);

    //   const isActiveTask = action.payload.active.data.current?.type === 'task';
    //   const isOverTask = action.payload.over.data.current?.type === 'task';

    //   if (isActiveTask && isOverTask) {
    //     const activeTaskId = action.payload.active.id;
    //     const overTaskId = action.payload.over.id;

    //     const activeOrder = action.payload.active.data.current?.order_index;
    //     const overOrder = action.payload.active.data.current?.order_index;

    //     const activeStatus = action.payload.active.data.current?.status;
    //     const overStatus = action.payload.over.data.current?.status;

    //     const activeIndex = state.tasks.findIndex((task) => task.id === activeTaskId);
    //     const overIndex = state.tasks.findIndex((task) => task.id === overTaskId);

    //     if (state.tasks[activeIndex].status === overStatus) {
    //       state.tasks[activeIndex].order_index = overOrder;
    //       state.tasks[overIndex].order_index = activeOrder;
    //     } else {
    //       const sortedData = state.tasks.sort((a, b) => b.order_index - a.order_index);
    //       sortedData.forEach((task) => {
    //         if (task.status === overStatus && task.order_index >= overIndex) {
    //           const sortingIndex = state.tasks.indexOf(task);
    //           state.tasks[sortingIndex].order_index += 1;
    //         }
    //       });
    //       state.tasks[activeIndex].status = overStatus;
    //       state.tasks[activeIndex].order_index = overOrder;
    //     }
    //   }
    // },

    setIdDraggingComponent: (state, action) => {
      state.idDraggingComponent = action.payload;
    },

    setUploadAttachment: (state, action) => {
      const getDate = (date) => {
        return `${date.getDate(date)}.${date.getMonth(date) + 1}.${date.getFullYear(
          date,
        )} ${date.getHours(date)}:${date.getMinutes(date)}`;
      };

      const newFile = action.payload.acceptedFiles[0];
      newFile['uploadTime'] = { dateFormat: Date(Date.now()), stringFormat: getDate(new Date()) };
      const id = state.tasks.indexOf(state.tasks.find((task) => task.id === action.payload.id));
      const fileList = state.tasks[id].attachments;
      newFile['id'] = fileList.length > 0 ? fileList.at(-1).id + 1 : 0;
      const file = new FileReader();
      file.readAsDataURL(action.payload.acceptedFiles[0]);
      file.onload = function () {
        newFile['preview'] = file.result;
        if (newFile) {
          const updatedList = [...fileList, newFile];
          state.tasks[id].attachments = updatedList;
        }
      };
    },

    setRemoveAttachment: (state, action) => {
      const id = state.tasks.indexOf(state.tasks.find((task) => task.id === action.payload.id));
      state.tasks[id].attachments = state.tasks[id].attachments.filter((file) => {
        return file.id !== action.payload.item.id;
      });
    },
  },
});

export const {
  setModal,
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
} = taskSlice.actions;

export default taskSlice.reducer;
