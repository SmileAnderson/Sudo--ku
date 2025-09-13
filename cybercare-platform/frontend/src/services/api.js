// src/services/api.js - API communication service
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

  // Compliance API
  async getComplianceData() {
    return this.request('/compliance');
  }

  async updateComplianceCheck(category, itemId, checked) {
    return this.request('/compliance/check', {
      method: 'PUT',
      body: { category, itemId, checked }
    });
  }

  async updateComplianceScore(auditResults) {
    return this.request('/compliance/score', {
      method: 'PUT',
      body: { auditResults }
    });
  }

  async exportComplianceReport() {
    return this.request('/compliance/export');
  }

  // Training API
  async getTrainingData() {
    return this.request('/training');
  }

  async getTrainingModules() {
    return this.request('/training/modules');
  }

  async getTrainingQuestions(moduleId) {
    return this.request(`/training/questions/${moduleId}`);
  }

  async completeTrainingModule(moduleId, score, answers) {
    return this.request('/training/complete', {
      method: 'POST',
      body: { moduleId, score, answers }
    });
  }

  async updateLeaderboard(userScore) {
    return this.request('/training/leaderboard', {
      method: 'PUT',
      body: { userScore }
    });
  }

  // Incidents API
  async getIncidents() {
    return this.request('/incidents');
  }

  async createIncident(incidentData) {
    return this.request('/incidents', {
      method: 'POST',
      body: incidentData
    });
  }

  async updateIncident(id, updates) {
    return this.request(`/incidents/${id}`, {
      method: 'PUT',
      body: updates
    });
  }

  async getIncidentStats() {
    return this.request('/incidents/stats/overview');
  }

  // Audit API
  async startAudit(target) {
    return this.request('/audit/start', {
      method: 'POST',
      body: { target }
    });
  }

  async getAuditStatus() {
    return this.request('/audit/status');
  }

  async getAuditResults(auditId = null) {
    const endpoint = auditId ? `/audit/results/${auditId}` : '/audit/results';
    return this.request(endpoint);
  }

  async getAuditHistory(limit = 10) {
    return this.request(`/audit/history?limit=${limit}`);
  }

  async generateRiskAssessment(auditResults) {
    return this.request('/audit/risk-assessment', {
      method: 'POST',
      body: { auditResults }
    });
  }

  // Notifications API
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT'
    });
  }

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE'
    });
  }

  async getUnreadCount() {
    return this.request('/notifications/unread-count');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  //Auth API
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
}

export default new ApiService();