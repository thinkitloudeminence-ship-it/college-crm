import api from '../utils/api'

const leadService = {
  // Get all leads (admin only)
  async getLeads(filters = {}) {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key])
      }
    })
    
    const response = await api.get(`/admin/leads?${params}`)
    return response
  },

  // Get telecaller's leads
  async getTelecallerLeads(filters = {}) {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key])
      }
    })
    
    const response = await api.get(`/telecaller/leads?${params}`)
    return response
  },

  // Get lead by ID
  async getLead(leadId) {
    const response = await api.get(`/leads/${leadId}`)
    return response
  },

  // Get lead for calling (reveals phone number)
  async getLeadForCall(leadId) {
    const response = await api.get(`/telecaller/leads/${leadId}/call`)
    return response
  },

  // Upload leads via Excel
  async uploadLeads(formData) {
    const response = await api.post('/admin/leads/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Assign leads to telecaller
  async assignLeads(assignmentData) {
    const response = await api.post('/admin/leads/assign', assignmentData)
    return response
  },

  // Update lead status
  async updateLeadStatus(leadId, updateData) {
    const response = await api.put(`/telecaller/leads/${leadId}`, updateData)
    return response
  },

  // Get dashboard statistics (admin)
  async getDashboardStats() {
    const response = await api.get('/admin/dashboard')
    return response
  },

  // Get telecaller dashboard
  async getTelecallerDashboard() {
    const response = await api.get('/telecaller/dashboard')
    return response
  },

  // Initiate call to lead
  async initiateCall(leadId) {
    const response = await api.post(`/telecaller/leads/${leadId}/initiate-call`)
    return response
  },

  // Get follow-up leads
  async getFollowUpLeads(days = 7) {
    const response = await api.get(`/telecaller/follow-ups?days=${days}`)
    return response
  },

  // Get performance report
  async getPerformanceReport(period = '30days') {
    const response = await api.get(`/telecaller/performance?period=${period}`)
    return response
  },
}

export default leadService