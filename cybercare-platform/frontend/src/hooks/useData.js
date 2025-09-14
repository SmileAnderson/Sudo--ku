// src/hooks/useData.js - Custom hooks for data management
import { useState, useEffect } from 'react';
import ApiService from '../services/api';

// Hook for compliance data
export const useCompliance = () => {
  const [complianceData, setComplianceData] = useState({
    score: 0,
    checks: {},
    lastScan: null,
    history: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getComplianceData();
      setComplianceData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch compliance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateComplianceCheck = async (category, itemId, checked) => {
    try {
      const updatedData = await ApiService.updateComplianceCheck(category, itemId, checked);
      setComplianceData(updatedData);
      return updatedData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateComplianceScore = async (auditResults) => {
    try {
      const updatedData = await ApiService.updateComplianceScore(auditResults);
      setComplianceData(updatedData);
      return updatedData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  return {
    complianceData,
    loading,
    error,
    updateComplianceCheck,
    updateComplianceScore,
    refetch: fetchComplianceData
  };
};

// Hook for incidents
export const useIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getIncidents();
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const createIncident = async (incidentData) => {
    try {
      const newIncident = await ApiService.createIncident(incidentData);
      setIncidents(prev => [newIncident, ...prev]);
      return newIncident;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateIncident = async (id, updates) => {
    try {
      const updatedIncident = await ApiService.updateIncident(id, updates);
      setIncidents(prev => prev.map(inc => inc.id === id ? updatedIncident : inc));
      return updatedIncident;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return {
    incidents,
    loading,
    error,
    createIncident,
    updateIncident,
    refetch: fetchIncidents
  };
};

// Hook for audit results
export const useAudit = () => {
  const [auditResults, setAuditResults] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const startAudit = async (target = '81.180.68.7') => {
    try {
      setIsScanning(true);
      setAuditResults({ loading: true });
      setError(null);
      
      // Always scan ase.md IP address as requested
      await ApiService.startAudit('81.180.68.7');
      
      // Poll for results
      const pollResults = async () => {
        try {
          const results = await ApiService.getAuditResults();
          if (results && results.status === 'completed') {
            setAuditResults(results);
            setIsScanning(false);
            
            // Generate risk assessment
            const risks = await ApiService.generateRiskAssessment(results);
            setRiskAssessment(risks);
          } else if (results && results.status === 'running') {
            // Continue polling
            setTimeout(pollResults, 2000);
          } else {
            setIsScanning(false);
          }
        } catch (err) {
          setError(err.message);
          setIsScanning(false);
        }
      };
      
      // Start polling after initial delay
      setTimeout(pollResults, 3000);
      
    } catch (err) {
      setError(err.message);
      setIsScanning(false);
      setAuditResults(null);
    }
  };

  const getAuditHistory = async (limit = 10) => {
    try {
      return await ApiService.getAuditHistory(limit);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    auditResults,
    riskAssessment,
    isScanning,
    error,
    startAudit,
    getAuditHistory
  };
};

// Hook for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [notificationsList, countData] = await Promise.all([
        ApiService.getNotifications(),
        ApiService.getUnreadCount()
      ]);
      setNotifications(notificationsList);
      setUnreadCount(countData.count);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await ApiService.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await ApiService.markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteNotification = async (id) => {
    try {
      await ApiService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};