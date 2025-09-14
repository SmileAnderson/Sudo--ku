// src/components/Header.js - Enhanced Header component with authentication
import React, { useState } from 'react';
import { Shield, Bell, LogOut } from 'lucide-react';
import { styles } from '../styles/styles';
import { useNotifications } from '../hooks/useData';

const Header = ({ user, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.logo}>
          <Shield color="#3b82f6" size={32} />
          <div>
            <h1 style={styles.logoText}>CyberCare</h1>
            <p style={styles.logoSubtext}>Moldova Cybersecurity Law Compliance Platform</p>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={{ position: 'relative' }}>
            <button 
              style={styles.notificationBell}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell color="#64748b" size={18} />
              {unreadCount > 0 && (
                <span style={styles.notificationBadge}>
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '320px',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                marginTop: '8px'
              }}>
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#0f172a' }}>
                    Notifications
                  </h4>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: '20px'
                    }}
                  >
                    ×
                  </button>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          cursor: 'pointer',
                          backgroundColor: notification.read ? '#ffffff' : '#f8fafc'
                        }}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: notification.type === 'critical' ? '#dc2626' : 
                                         notification.type === 'warning' ? '#f59e0b' : '#3b82f6',
                          marginTop: '6px'
                        }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ 
                            fontSize: '14px', 
                            fontWeight: notification.read ? '400' : '600', 
                            margin: '0 0 4px 0', 
                            color: '#0f172a' 
                          }}>
                            {notification.message}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                            {notification.time}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '2px',
                            fontSize: '14px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Info and Logout Section */}
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            {user && (
              <div style={{textAlign: 'right', marginRight: '12px'}}>
                <p style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                  {user.companyName}
                </p>
                <p style={{fontSize: '12px', color: '#64748b', margin: 0}}>
                  {user.email}
                </p>
              </div>
            )}
            {user && onLogout && (
              <button
                onClick={onLogout}
                style={{
                  ...styles.btn,
                  ...styles.btnSecondary,
                  padding: '8px 12px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            )}
          </div>
          
          <span style={styles.lawText}>Law No. 48/2023</span>
          <button style={styles.supportBtn}>
            Contact Support
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;