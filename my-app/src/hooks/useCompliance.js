import { useState, useEffect } from 'react';
import { STORAGE_KEYS, SCORING } from '../utils/constants.js';

export const useCompliance = () => {
  const [complianceData, setComplianceData] = useState({
    score: 0,
    checks: {},
    lastScan: null,
    categories: {}
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load compliance data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEYS.COMPLIANCE_DATA);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setComplianceData(prev => ({
          ...prev,
          ...parsed
        }));
      }
    } catch (err) {
      console.error('Error loading compliance data:', err);
      setError('Failed to load compliance data');
    }
  }, []);

  // Save to localStorage whenever compliance data changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.COMPLIANCE_DATA, 
        JSON.stringify(complianceData)
      );
    } catch (err) {
      console.error('Error saving compliance data:', err);
    }
  }, [complianceData]);

  // Update a specific compliance check
  const updateComplianceCheck = (category, itemId, checked) => {
    setComplianceData(prev => {
      const newChecks = {
        ...prev.checks,
        [`${category}-${itemId}`]: checked
      };

      // Calculate new score based on completed checks
      const completedCount = Object.values(newChecks).filter(Boolean).length;
      const totalCount = 48; // Total compliance items
      const newScore = Math.round((completedCount / totalCount) * 100);

      return {
        ...prev,
        checks: newChecks,
        score: newScore
      };
    });
  };

  // Get compliance status based on score
  const getComplianceStatus = (score = complianceData.score) => {
    if (score >= SCORING.COMPLIANCE_GOOD) {
      return {
        level: 'good',
        label: 'Good Compliance',
        color: '#059669',
        bgColor: '#dcfce7'
      };
    }
    if (score >= SCORING.COMPLIANCE_WARNING) {
      return {
        level: 'warning',
        label: 'Needs Improvement',
        color: '#d97706',
        bgColor: '#fef3c7'
      };
    }
    return {
      level: 'critical',
      label: 'Critical Issues',
      color: '#dc2626',
      bgColor: '#fee2e2'
    };
  };

  // Calculate completion statistics
  const getCompletionStats = () => {
    const totalItems = 48; // Based on compliance checklist
    const completedItems = Object.values(complianceData.checks).filter(Boolean).length;
    const overallProgress = Math.round((completedItems / totalItems) * 100);

    return {
      totalItems,
      completedItems,
      overallProgress
    };
  };

  // Reset all compliance data
  const resetCompliance = () => {
    setComplianceData({
      score: 0,
      checks: {},
      lastScan: null,
      categories: {}
    });
  };

  return {
    // State
    complianceData,
    loading,
    error,
    
    // Actions
    updateComplianceCheck,
    resetCompliance,
    
    // Computed values
    getComplianceStatus,
    getCompletionStats
  };
};