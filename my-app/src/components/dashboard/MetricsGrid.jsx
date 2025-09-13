import React from 'react';
import { BarChart3, AlertTriangle, GraduationCap } from 'lucide-react';
import MetricCard from '../common/MetricCard.jsx';
import { grid } from '../../styles/theme.js';

const MetricsGrid = ({ data }) => {
  const metrics = [
    {
      id: 'compliance',
      title: 'Compliance Score',
      value: `${data.compliance.score}%`,
      subtitle: data.compliance.status.label,
      icon: BarChart3,
      color: data.compliance.status.color,
      bgColor: data.compliance.status.bgColor
    },
    {
      id: 'risk',
      title: 'Risk Score',
      value: `${data.audit.riskScore}/10`,
      subtitle: 'Current risk level',
      icon: AlertTriangle,
      color: '#ea580c',
      bgColor: '#fed7aa'
    },
    {
      id: 'training',
      title: 'Training Progress',
      value: `${data.training.completedModules}/${data.training.totalModules}`,
      subtitle: 'Modules completed',
      icon: GraduationCap,
      color: '#8b5cf6',
      bgColor: '#f3e8ff'
    }
  ];

  return (
    <div style={grid.grid3}>
      {metrics.map(metric => (
        <MetricCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          icon={metric.icon}
          color={metric.color}
          bgColor={metric.bgColor}
        />
      ))}
    </div>
  );
};

export default MetricsGrid;