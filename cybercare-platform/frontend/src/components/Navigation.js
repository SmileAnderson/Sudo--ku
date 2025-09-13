// src/components/Navigation.js - Navigation component
import React from 'react';
import { BarChart3, CheckCircle, GraduationCap, AlertTriangle, FileText } from 'lucide-react';
import { styles } from '../styles/styles';

const iconMap = {
  BarChart3,
  CheckCircle, 
  GraduationCap,
  AlertTriangle,
  FileText
};

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'compliance', label: 'Compliance', icon: 'CheckCircle' },
    { id: 'training', label: 'Training', icon: 'GraduationCap' },
    { id: 'incidents', label: 'Incidents', icon: 'AlertTriangle' },
    { id: 'resources', label: 'Resources', icon: 'FileText' }
  ];

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => {
        const IconComponent = iconMap[tab.icon];
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.navBtn,
              ...(activeTab === tab.id ? styles.navBtnActive : styles.navBtnInactive)
            }}
          >
            <IconComponent size={18} />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;