import { createSlice } from '@reduxjs/toolkit'

import data from '../asset/data.json'

const initialState = {
  tasks: data,
  statuses: ["To Do", "In Progress", "Done"],
  modal: {'isOpen': false , 'id': null},
  idDraggingComponent: null,
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.modal.isOpen = action.payload.isOpen
      state.modal.id = action.payload.id
    },
    setData: (state, action) => { state.tasks = action.payload },
    setStatus: (state, action) => { 
      const changingTask = state.tasks.find(task => task.id === action.payload.id)
      const id = state.tasks.indexOf(changingTask)
      changingTask.status = action.payload.status
      state.tasks[id] = changingTask
     },
    setIdDraggingComponent: (state, action) => { 
      state.idDraggingComponent= action.payload;
     },
  },
})

export const {
  setModal,
  setData,
  setStatus,
  setIdDraggingComponent,
} = taskSlice.actions;

export default taskSlice.reducer