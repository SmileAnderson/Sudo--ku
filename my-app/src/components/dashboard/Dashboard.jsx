import React from 'react';
import MetricsGrid from './MetricsGrid.jsx';
import QuickActions from './QuickActions.jsx';
import AuditResults from './AuditResults.jsx';
import NotificationList from './NotificationList.jsx';
import { useAudit } from '../../hooks/useAudit.js';
import { useCompliance } from '../../hooks/useCompliance.js';
import { useTraining } from '../../hooks/useTraining.js';

const Dashboard = () => {
  const { auditResults, runAudit, loading: auditLoading } = useAudit();
  const { complianceData, getComplianceStatus } = useCompliance();
  const { trainingData } = useTraining();

  const dashboardData = {
    compliance: {
      score: complianceData.score,
      status: getComplianceStatus(),
      lastScan: complianceData.lastScan
    },
    audit: {
      results: auditResults,
      loading: auditLoading,
      riskScore: auditResults?.riskScore || 0
    },
    training: {
      completedModules: trainingData.completedModules.length,
      totalModules: 6 // Based on training modules
    }
  };

  return (
    <div>
      <MetricsGrid data={dashboardData} />
      
      <QuickActions 
        onRunAudit={runAudit}
        auditLoading={auditLoading}
      />
      
      {auditResults && (
        <AuditResults 
          results={auditResults}
          loading={auditLoading}
        />
      )}
      
      <NotificationList />
    </div>
  );
};

export default Dashboard;