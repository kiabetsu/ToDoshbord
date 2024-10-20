import { createSlice } from '@reduxjs/toolkit'

import data from '../asset/data.json'

const initialState = {
  tasks: 1,
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers:{

  }
})


export default taskSlice.reducer