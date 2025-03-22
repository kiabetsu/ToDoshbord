import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { AuthService } from '../service/AuthService';
import axios from 'axios';

const initialState = {
  user: {},
  isAuth: false,
  status: '',
  isLoading: false,
};

export const registration = createAsyncThunk(
  'auth/registration',
  async ({ username, email, password }) => {
    try {
      console.log('zashel');
      const res = await axios.post('http://localhost:5000/api/registration', {
        username,
        email,
        password,
      });
      return res.data;
    } catch (error) {
      throw new Error('error per registration');
    }
  },
);

export const login = createAsyncThunk('auth/login', async ({ username, password }) => {
  try {
    console.log('i try', username, password);
    const res = await axios.post(
      'http://localhost:5000/api/login',
      { username, password },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    throw new Error('error per login');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    checkAuth: (state, action) => {
      state.isLoading = true;
      if (localStorage.getItem('token')) {
        state.isAuth = true;
        state.user = JSON.parse(localStorage.getItem('user'));
      }
      state.isLoading = false;
    },
    logout: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.status = 'padding';
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.status = 'success';
      state.isAuth = true;
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.user = action.payload.user;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.status = 'error';
    });

    builder.addCase(registration.pending, (state, action) => {
      state.status = 'padding';
    });
    builder.addCase(registration.fulfilled, (state, action) => {
      state.status = 'success';
      state.isAuth = true;
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.user = action.payload.user;
    });
    builder.addCase(registration.rejected, (state, action) => {
      state.status = 'error';
    });
  },
});

export const { checkAuth, logout } = authSlice.actions;

export default authSlice.reducer;
