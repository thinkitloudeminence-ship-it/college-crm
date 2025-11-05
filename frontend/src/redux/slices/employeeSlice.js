// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import employeeService from '../../services/employeeService'

// // Async thunks
// export const createEmployee = createAsyncThunk(
//   'employees/create',
//   async (employeeData, { rejectWithValue }) => {
//     try {
//       const response = await employeeService.createEmployee(employeeData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getEmployees = createAsyncThunk(
//   'employees/getAll',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const response = await employeeService.getEmployees(filters)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getEmployee = createAsyncThunk(
//   'employees/getOne',
//   async (employeeId, { rejectWithValue }) => {
//     try {
//       const response = await employeeService.getEmployee(employeeId)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const updateEmployee = createAsyncThunk(
//   'employees/update',
//   async ({ employeeId, employeeData }, { rejectWithValue }) => {
//     try {
//       const response = await employeeService.updateEmployee(employeeId, employeeData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const deleteEmployee = createAsyncThunk(
//   'employees/delete',
//   async (employeeId, { rejectWithValue }) => {
//     try {
//       const response = await employeeService.deleteEmployee(employeeId)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// const employeeSlice = createSlice({
//   name: 'employees',
//   initialState: {
//     employees: [],
//     currentEmployee: null,
//     loading: false,
//     error: null,
//     success: false,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null
//     },
//     clearSuccess: (state) => {
//       state.success = false
//     },
//     setCurrentEmployee: (state, action) => {
//       state.currentEmployee = action.payload
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create Employee
//       .addCase(createEmployee.pending, (state) => {
//         state.loading = true
//         state.error = null
//         state.success = false
//       })
//       .addCase(createEmployee.fulfilled, (state, action) => {
//         state.loading = false
//         state.success = true
//         state.employees.push(action.payload.data)
//       })
//       .addCase(createEmployee.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to create employee'
//       })
//       // Get Employees
//       .addCase(getEmployees.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getEmployees.fulfilled, (state, action) => {
//         state.loading = false
//         state.employees = action.payload.data
//       })
//       .addCase(getEmployees.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch employees'
//       })
//       // Get Employee
//       .addCase(getEmployee.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getEmployee.fulfilled, (state, action) => {
//         state.loading = false
//         state.currentEmployee = action.payload.data
//       })
//       .addCase(getEmployee.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch employee'
//       })
//       // Update Employee
//       .addCase(updateEmployee.pending, (state) => {
//         state.loading = true
//         state.error = null
//         state.success = false
//       })
//       .addCase(updateEmployee.fulfilled, (state, action) => {
//         state.loading = false
//         state.success = true
//         const index = state.employees.findIndex(emp => emp._id === action.payload.data._id)
//         if (index !== -1) {
//           state.employees[index] = action.payload.data
//         }
//         if (state.currentEmployee && state.currentEmployee._id === action.payload.data._id) {
//           state.currentEmployee = action.payload.data
//         }
//       })
//       .addCase(updateEmployee.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to update employee'
//       })
//       // Delete Employee
//       .addCase(deleteEmployee.pending, (state) => {
//         state.loading = true
//         state.error = null
//         state.success = false
//       })
//       .addCase(deleteEmployee.fulfilled, (state, action) => {
//         state.loading = false
//         state.success = true
//         state.employees = state.employees.filter(emp => emp._id !== action.meta.arg)
//         if (state.currentEmployee && state.currentEmployee._id === action.meta.arg) {
//           state.currentEmployee = null
//         }
//       })
//       .addCase(deleteEmployee.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to delete employee'
//       })
//   },
// })

// export const { clearError, clearSuccess, setCurrentEmployee } = employeeSlice.actions
// export default employeeSlice.reducer

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { API_BASE_URL } from '../../config';

// const API_BASE_URL = 'http://localhost:5000/api';

// // Async thunks
// export const getEmployees = createAsyncThunk(
//   'employees/getEmployees',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.get(`${API_BASE_URL}/admin/employees`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch employees'
//       );
//     }
//   }
// );

// export const createEmployee = createAsyncThunk(
//   'employees/createEmployee',
//   async (employeeData, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.post(`${API_BASE_URL}/admin/employees`, employeeData, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to create employee'
//       );
//     }
//   }
// );

// const employeeSlice = createSlice({
//   name: 'employees',
//   initialState: {
//     employees: [],
//     loading: false,
//     error: null
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Employees
//       .addCase(getEmployees.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getEmployees.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employees = action.payload.data;
//         state.error = null;
//       })
//       .addCase(getEmployees.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Create Employee
//       .addCase(createEmployee.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createEmployee.fulfilled, (state, action) => {
//         state.loading = false;
//         state.employees.push(action.payload.data);
//         state.error = null;
//       })
//       .addCase(createEmployee.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   }
// });

// export const { clearError } = employeeSlice.actions;
// export default employeeSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getEmployees = createAsyncThunk(
  'employees/getEmployees',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/admin/employees`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch employees'
      );
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/admin/employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create employee'
      );
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload.data);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = employeeSlice.actions;
export default employeeSlice.reducer;