import api from '../utils/api'

const employeeService = {
  // Create new employee
  async createEmployee(employeeData) {
    const response = await api.post('/admin/employees', employeeData)
    return response
  },

  // Get all employees
  async getEmployees(filters = {}) {
    const params = new URLSearchParams()
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key])
      }
    })
    
    const response = await api.get(`/admin/employees?${params}`)
    return response
  },

  // Get employee by ID
  async getEmployee(employeeId) {
    const response = await api.get(`/admin/employees/${employeeId}`)
    return response
  },

  // Update employee
  async updateEmployee(employeeId, employeeData) {
    const response = await api.put(`/admin/employees/${employeeId}`, employeeData)
    return response
  },

  // Delete employee (soft delete)
  async deleteEmployee(employeeId) {
    const response = await api.delete(`/admin/employees/${employeeId}`)
    return response
  },
}

export default employeeService