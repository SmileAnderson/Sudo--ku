// src/services/api.js - Complete API communication service
import { API_BASE_URL } from '../data/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth API
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: credentials
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async verifyMFA(data) {
    return this.request('/api/auth/verify-mfa', {
      method: 'POST',
      body: data
    });
  }

  async resendMFA(email) {
    return this.request('/api/auth/resend-mfa', {
      method: 'POST',
      body: { email }
    });
  }

  // Compliance API
  async getComplianceData() {
    return this.request('/api/compliance');
  }

  async updateComplianceCheck(category, itemId, checked) {
    return this.request('/api/compliance/check', {
      method: 'PUT',
      body: { category, itemId, checked }
    });
  }

  async updateComplianceScore(auditResults) {
    return this.request('/api/compliance/score', {
      method: 'PUT',
      body: { auditResults }
    });
  }

  async exportComplianceReport() {
    return this.request('/api/compliance/export');
  }

  // Incidents API
  async getIncidents() {
    return this.request('/api/incidents');
  }

  async createIncident(incidentData) {
    return this.request('/api/incidents', {
      method: 'POST',
      body: incidentData
    });
  }

  async updateIncident(id, updates) {
    return this.request(`/api/incidents/${id}`, {
      method: 'PUT',
      body: updates
    });
  }

  async getIncidentStats() {
    return this.request('/api/incidents/stats/overview');
  }

  // Audit API
  async startAudit(target) {
    return this.request('/api/audit/start', {
      method: 'POST',
      body: { target }
    });
  }

  async getAuditStatus() {
    return this.request('/api/audit/status');
  }

  async getAuditResults(auditId = null) {
    const endpoint = auditId ? `/api/audit/results/${auditId}` : '/api/audit/results';
    return this.request(endpoint);
  }

  async getAuditHistory(limit = 10) {
    return this.request(`/api/audit/history?limit=${limit}`);
  }

  async generateRiskAssessment(auditResults) {
    return this.request('/api/audit/risk-assessment', {
      method: 'POST',
      body: { auditResults }
    });
  }

  // Notifications API
  async getNotifications() {
    return this.request('/api/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/api/notifications/read-all', {
      method: 'PUT'
    });
  }

  async deleteNotification(id) {
    return this.request(`/api/notifications/${id}`, {
      method: 'DELETE'
    });
  }

  async getUnreadCount() {
    return this.request('/api/notifications/unread-count');
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Assessment-Compliance Sync API methods
async submitAssessmentAndSync(assessmentAnswers) {
  return this.request('/api/assessment/submit-and-sync', {
    method: 'POST',
    body: { 
      answers: assessmentAnswers,
      syncToCompliance: true 
    }
  });
}

async syncAssessmentToCompliance(assessmentAnswers) {
  return this.request('/api/compliance/sync-from-assessment', {
    method: 'POST',
    body: { assessmentAnswers }
  });
}

async getAssessmentQuestions() {
  return this.request('/api/assessment/questions');
}

async saveAssessmentProgress(answers) {
  return this.request('/api/assessment/progress', {
    method: 'PUT',
    body: { answers }
  });
}
}

export default new ApiService();