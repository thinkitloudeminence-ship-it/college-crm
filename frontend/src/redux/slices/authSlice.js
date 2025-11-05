// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import authService from '../../services/authService'

// // Get user from localStorage
// const user = JSON.parse(localStorage.getItem('user'))

// const initialState = {
//   user: user ? user : null,
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: '',
// }

// // Login user
// export const login = createAsyncThunk(
//   'auth/login',
//   async ({ email, password, userType }, thunkAPI) => {
//     try {
//       return await authService.login(email, password, userType)
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

// // Logout user
// export const logout = createAsyncThunk('auth/logout', async () => {
//   await authService.logout()
// })

// // Check authentication
// export const checkAuth = createAsyncThunk('auth/check', async (_, thunkAPI) => {
//   try {
//     return await authService.checkAuth()
//   } catch (error) {
//     return thunkAPI.rejectWithValue('Authentication check failed')
//   }
// })

// // Change password
// export const changePassword = createAsyncThunk(
//   'auth/changePassword',
//   async ({ currentPassword, newPassword }, thunkAPI) => {
//     try {
//       return await authService.changePassword(currentPassword, newPassword)
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     reset: (state) => {
//       state.isLoading = false
//       state.isSuccess = false
//       state.isError = false
//       state.message = ''
//     },
//     clearError: (state) => {
//       state.isError = false
//       state.message = ''
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(login.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.isSuccess = true
//         state.user = action.payload.user
//         state.message = 'Login successful'
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false
//         state.isError = true
//         state.message = action.payload
//         state.user = null
//       })
//       // Logout
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null
//         state.isSuccess = false
//       })
//       // Check Auth
//       .addCase(checkAuth.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.user = action.payload.user
//       })
//       .addCase(checkAuth.rejected, (state) => {
//         state.isLoading = false
//         state.user = null
//         localStorage.removeItem('user')
//       })
//       // Change Password
//       .addCase(changePassword.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(changePassword.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.isSuccess = true
//         state.message = action.payload.message
//       })
//       .addCase(changePassword.rejected, (state, action) => {
//         state.isLoading = false
//         state.isError = true
//         state.message = action.payload
//       })
//   },
// })

// export const { reset, clearError } = authSlice.actions
// export default authSlice.reducer



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      return rejectWithValue('Authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    isAuthenticated: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;