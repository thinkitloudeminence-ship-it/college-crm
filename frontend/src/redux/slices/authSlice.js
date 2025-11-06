
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_URL}/auth/login`, {
//         email,
//         password
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Login failed'
//       );
//     }
//   }
// );

// export const checkAuth = createAsyncThunk(
//   'auth/checkAuth',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token found');
//       }

//       const response = await axios.get(`${API_URL}/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       localStorage.removeItem('token');
//       return rejectWithValue('Authentication failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: localStorage.getItem('token'),
//     isLoading: false,
//     isAuthenticated: false,
//     error: null
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem('token');
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//         state.isAuthenticated = true;
//         state.error = null;
//         localStorage.setItem('token', action.payload.token);
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//         state.isAuthenticated = false;
//       })
//       .addCase(checkAuth.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(checkAuth.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.data;
//         state.isAuthenticated = true;
//         state.error = null;
//       })
//       .addCase(checkAuth.rejected, (state) => {
//         state.isLoading = false;
//         state.user = null;
//         state.token = null;
//         state.isAuthenticated = false;
//         state.error = null;
//       });
//   }
// });

// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Production aur Development ke liye different API URLs
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://college-crm.onrender.com/api' 
  : 'http://localhost:5000/api';

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