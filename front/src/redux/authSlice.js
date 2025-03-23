import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { AuthService } from '../service/AuthService';
import axios from 'axios';

const initialState = {
  user: {},
  isAuth: false,
  status: '',
  isLoading: false,
};

const URL = 'http://localhost:5000/api/';

export const registration = createAsyncThunk(
  'auth/registration',
  async ({ username, email, password }) => {
    try {
      const res = await axios.post(URL + 'registration', {
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
    const res = await axios.post(URL + 'login', { username, password }, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw new Error('error per login');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.get(URL + 'logout', { withCredentials: true });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {};
  } catch (error) {}
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
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = 'padding';
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.status = 'success';
      state.isAuth = true;
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.user = action.payload.user;
    });

    builder.addCase(login.rejected, (state) => {
      state.status = 'error';
    });

    builder.addCase(registration.pending, (state) => {
      state.status = 'padding';
    });
    builder.addCase(registration.fulfilled, (state, action) => {
      state.status = 'success';
      state.isAuth = true;
      localStorage.setItem('token', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      state.user = action.payload.user;
    });
    builder.addCase(registration.rejected, (state) => {
      state.status = 'error';
    });

    builder.addCase(logout.pending, (state) => {
      state.status = 'padding';
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.status = 'success';
      state.isAuth = false;
      localStorage.removeItem('token');
    });
    builder.addCase(logout.rejected, (state) => {
      state.status = 'error';
    });
  },
});

export const { checkAuth } = authSlice.actions;

export default authSlice.reducer;
