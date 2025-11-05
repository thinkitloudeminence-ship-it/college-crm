// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import leadService from '../../services/leadService'

// // Async thunks
// export const getLeads = createAsyncThunk(
//   'leads/getAll',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const response = await leadService.getLeads(filters)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getTelecallerLeads = createAsyncThunk(
//   'leads/getTelecallerLeads',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const response = await leadService.getTelecallerLeads(filters)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getLead = createAsyncThunk(
//   'leads/getOne',
//   async (leadId, { rejectWithValue }) => {
//     try {
//       const response = await leadService.getLead(leadId)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getLeadForCall = createAsyncThunk(
//   'leads/getForCall',
//   async (leadId, { rejectWithValue }) => {
//     try {
//       const response = await leadService.getLeadForCall(leadId)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const uploadLeads = createAsyncThunk(
//   'leads/upload',
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await leadService.uploadLeads(formData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const assignLeads = createAsyncThunk(
//   'leads/assign',
//   async (assignmentData, { rejectWithValue }) => {
//     try {
//       const response = await leadService.assignLeads(assignmentData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const updateLeadStatus = createAsyncThunk(
//   'leads/updateStatus',
//   async ({ leadId, ...updateData }, { rejectWithValue }) => {
//     try {
//       const response = await leadService.updateLeadStatus(leadId, updateData)
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getDashboardStats = createAsyncThunk(
//   'leads/getDashboardStats',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await leadService.getDashboardStats()
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// export const getTelecallerDashboard = createAsyncThunk(
//   'leads/getTelecallerDashboard',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await leadService.getTelecallerDashboard()
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response.data)
//     }
//   }
// )

// const leadSlice = createSlice({
//   name: 'leads',
//   initialState: {
//     leads: [],
//     telecallerLeads: [],
//     currentLead: null,
//     dashboardStats: null,
//     telecallerDashboard: null,
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
//     setCurrentLead: (state, action) => {
//       state.currentLead = action.payload
//     },
//     clearCurrentLead: (state) => {
//       state.currentLead = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Leads
//       .addCase(getLeads.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getLeads.fulfilled, (state, action) => {
//         state.loading = false
//         state.leads = action.payload.data
//       })
//       .addCase(getLeads.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch leads'
//       })
//       // Get Telecaller Leads
//       .addCase(getTelecallerLeads.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getTelecallerLeads.fulfilled, (state, action) => {
//         state.loading = false
//         state.telecallerLeads = action.payload.data
//       })
//       .addCase(getTelecallerLeads.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch telecaller leads'
//       })
//       // Get Lead
//       .addCase(getLead.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getLead.fulfilled, (state, action) => {
//         state.loading = false
//         state.currentLead = action.payload.data
//       })
//       .addCase(getLead.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch lead'
//       })
//       // Get Lead for Call
//       .addCase(getLeadForCall.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getLeadForCall.fulfilled, (state, action) => {
//         state.loading = false
//         state.currentLead = action.payload.data
//       })
//       .addCase(getLeadForCall.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch lead for call'
//       })
//       // Upload Leads
//       .addCase(uploadLeads.pending, (state) => {
//         state.loading = true
//         state.error = null
//         state.success = false
//       })
//       .addCase(uploadLeads.fulfilled, (state, action) => {
//         state.loading = false
//         state.success = true
//       })
//       .addCase(uploadLeads.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to upload leads'
//       })
//       // Assign Leads
//       .addCase(assignLeads.pending, (state) => {
//         state.loading = true
//         state.error = null
//         state.success = false
//       })
//       .addCase(assignLeads.fulfilled, (state, action) => {
//         state.loading = false
//         state.success = true
//       })
//       .addCase(assignLeads.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to assign leads'
//       })
//       // Update Lead Status
//       .addCase(updateLeadStatus.pending, (state) => {
//         state.loading = true
//         state.error = null
//         state.success = false
//       })
//       .addCase(updateLeadStatus.fulfilled, (state, action) => {
//         state.loading = false
//         state.success = true
//         // Update the lead in the lists
//         const updatedLead = action.payload.data
//         const leadIndex = state.leads.findIndex(lead => lead._id === updatedLead._id)
//         if (leadIndex !== -1) {
//           state.leads[leadIndex] = updatedLead
//         }
//         const telecallerIndex = state.telecallerLeads.findIndex(lead => lead._id === updatedLead._id)
//         if (telecallerIndex !== -1) {
//           state.telecallerLeads[telecallerIndex] = updatedLead
//         }
//         if (state.currentLead && state.currentLead._id === updatedLead._id) {
//           state.currentLead = updatedLead
//         }
//       })
//       .addCase(updateLeadStatus.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to update lead status'
//       })
//       // Get Dashboard Stats
//       .addCase(getDashboardStats.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getDashboardStats.fulfilled, (state, action) => {
//         state.loading = false
//         state.dashboardStats = action.payload.data
//       })
//       .addCase(getDashboardStats.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch dashboard stats'
//       })
//       // Get Telecaller Dashboard
//       .addCase(getTelecallerDashboard.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(getTelecallerDashboard.fulfilled, (state, action) => {
//         state.loading = false
//         state.telecallerDashboard = action.payload.data
//       })
//       .addCase(getTelecallerDashboard.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload?.message || 'Failed to fetch telecaller dashboard'
//       })
//   },
// })

// export const { clearError, clearSuccess, setCurrentLead, clearCurrentLead } = leadSlice.actions
// export default leadSlice.reducer

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { API_BASE_URL } from '../../config';


// const API_BASE_URL = 'http://localhost:5000/api';

// // Async thunks
// export const getLeads = createAsyncThunk(
//   'leads/getLeads',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.get(`${API_BASE_URL}/leads`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch leads'
//       );
//     }
//   }
// );

// export const getDashboardStats = createAsyncThunk(
//   'leads/getDashboardStats',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch dashboard stats'
//       );
//     }
//   }
// );

// export const uploadLeads = createAsyncThunk(
//   'leads/uploadLeads',
//   async (formData, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.post(`${API_BASE_URL}/admin/leads/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to upload leads'
//       );
//     }
//   }
// );

// export const assignLeads = createAsyncThunk(
//   'leads/assignLeads',
//   async (assignmentData, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.post(`${API_BASE_URL}/admin/leads/assign`, assignmentData, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to assign leads'
//       );
//     }
//   }
// );

// const leadSlice = createSlice({
//   name: 'leads',
//   initialState: {
//     leads: [],
//     dashboardStats: null,
//     loading: false,
//     error: null,
//     uploadProgress: 0
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setUploadProgress: (state, action) => {
//       state.uploadProgress = action.payload;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Leads
//       .addCase(getLeads.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         state.leads = action.payload.data;
//         state.error = null;
//       })
//       .addCase(getLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Get Dashboard Stats
//       .addCase(getDashboardStats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getDashboardStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.dashboardStats = action.payload.data;
//         state.error = null;
//       })
//       .addCase(getDashboardStats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Upload Leads
//       .addCase(uploadLeads.pending, (state) => {
//         state.loading = true;
//         state.uploadProgress = 0;
//         state.error = null;
//       })
//       .addCase(uploadLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         state.uploadProgress = 100;
//         state.error = null;
//       })
//       .addCase(uploadLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.uploadProgress = 0;
//         state.error = action.payload;
//       });
//   }
// });

// export const { clearError, setUploadProgress } = leadSlice.actions;
// export default leadSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { API_BASE_URL } from '../../config';

// // Async thunks - REMOVE duplicate API_BASE_URL declaration
// export const getLeads = createAsyncThunk(
//   'leads/getLeads',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.get(`${API_BASE_URL}/leads`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch leads'
//       );
//     }
//   }
// );

// export const getDashboardStats = createAsyncThunk(
//   'leads/getDashboardStats',
//   async (_, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to fetch dashboard stats'
//       );
//     }
//   }
// );

// export const uploadLeads = createAsyncThunk(
//   'leads/uploadLeads',
//   async (formData, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.post(`${API_BASE_URL}/admin/leads/upload`, formData, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to upload leads'
//       );
//     }
//   }
// );

// export const assignLeads = createAsyncThunk(
//   'leads/assignLeads',
//   async (assignmentData, { rejectWithValue, getState }) => {
//     try {
//       const { auth } = getState();
//       const response = await axios.post(`${API_BASE_URL}/admin/leads/assign`, assignmentData, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`
//         }
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || 'Failed to assign leads'
//       );
//     }
//   }
// );

// const leadSlice = createSlice({
//   name: 'leads',
//   initialState: {
//     leads: [],
//     dashboardStats: null,
//     loading: false,
//     error: null,
//     uploadProgress: 0
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setUploadProgress: (state, action) => {
//       state.uploadProgress = action.payload;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       // Get Leads
//       .addCase(getLeads.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         state.leads = action.payload.data;
//         state.error = null;
//       })
//       .addCase(getLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Get Dashboard Stats
//       .addCase(getDashboardStats.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getDashboardStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.dashboardStats = action.payload.data;
//         state.error = null;
//       })
//       .addCase(getDashboardStats.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       // Upload Leads
//       .addCase(uploadLeads.pending, (state) => {
//         state.loading = true;
//         state.uploadProgress = 0;
//         state.error = null;
//       })
//       .addCase(uploadLeads.fulfilled, (state, action) => {
//         state.loading = false;
//         state.uploadProgress = 100;
//         state.error = null;
//       })
//       .addCase(uploadLeads.rejected, (state, action) => {
//         state.loading = false;
//         state.uploadProgress = 0;
//         state.error = action.payload;
//       });
//   }
// });

// export const { clearError, setUploadProgress } = leadSlice.actions;
// export default leadSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getLeads = createAsyncThunk(
  'leads/getLeads',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/leads`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leads'
      );
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  'leads/getDashboardStats',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const assignLeads = createAsyncThunk(
  'leads/assignLeads',
  async ({ leadIds, employeeId }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/admin/leads/assign`, {
        leadIds,
        employeeId
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to assign leads'
      );
    }
  }
);

export const getTelecallerLeads = createAsyncThunk(
  'leads/getTelecallerLeads',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/telecaller/leads`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch leads'
      );
    }
  }
);

export const getLeadForCall = createAsyncThunk(
  'leads/getLeadForCall',
  async (leadId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/telecaller/leads/${leadId}/call`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch lead details'
      );
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  'leads/updateLeadStatus',
  async ({ leadId, status, callOutcome, nextFollowUp, callDuration, notes }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/telecaller/leads/${leadId}`, {
        status,
        callOutcome,
        nextFollowUp,
        callDuration,
        notes
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update lead'
      );
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState: {
    leads: [],
    currentLead: null,
    dashboardStats: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
      })
      .addCase(getLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTelecallerLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTelecallerLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
      })
      .addCase(getTelecallerLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeadForCall.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLeadForCall.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload.data;
      })
      .addCase(getLeadForCall.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentLead } = leadSlice.actions;
export default leadSlice.reducer;