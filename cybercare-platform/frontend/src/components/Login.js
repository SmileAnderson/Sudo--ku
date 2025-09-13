// src/components/Login.js - Fixed version using ApiService
import React, { useState } from 'react';
import { Shield, Mail, Lock, Building, AlertCircle, CheckCircle, User } from 'lucide-react';
import { styles } from '../styles/styles';
import ApiService from '../services/api'; // Fixed: removed destructuring

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login'); // 'login', 'register', 'mfa', 'success'
  const [formData, setFormData] = useState({
    idno: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    mfaCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaCodeSent, setMfaCodeSent] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await ApiService.register({
        idno: formData.idno,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName
      });

      setMode('success');
      setTimeout(() => {
        setMode('login');
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '', companyName: '' }));
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await ApiService.login({
        idno: formData.idno,
        email: formData.email,
        password: formData.password
      });

      if (data.requiresMFA) {
        setMode('mfa');
        setMfaCodeSent(true);
      } else {
        onLogin(data.user, data.token);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await ApiService.verifyMFA({
        email: formData.email,
        code: formData.mfaCode
      });

      setTimeout(() => {
        onLogin(data.user, data.token);
      }, 1000);
    } catch (error) {
      console.error('MFA verification error:', error);
      setError(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const resendMFACode = async () => {
    setLoading(true);
    try {
      await ApiService.resendMFA(formData.email);
      setMfaCodeSent(true);
    } catch (error) {
      console.error('Resend MFA error:', error);
      setError(error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component JSX stays exactly the same...
  if (mode === 'success') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <CheckCircle color="#059669" size={64} style={{marginBottom: '20px'}} />
          <h2 style={{fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '16px'}}>
            Registration Successful!
          </h2>
          <p style={{color: '#64748b', marginBottom: '20px'}}>
            Your account has been created successfully. You can now sign in with your credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px'}}>
            <Shield color="#3b82f6" size={32} />
            <h1 style={{fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0}}>
              CyberCare
            </h1>
          </div>
          <p style={{color: '#64748b', margin: 0}}>
            {mode === 'login' ? 'Sign in to your account' : 
             mode === 'register' ? 'Create your company account' :
             'Enter verification code'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle color="#dc2626" size={16} />
            <span style={{fontSize: '14px', color: '#dc2626'}}>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegistration}>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Company Name
              </label>
              <div style={{position: 'relative'}}>
                <Building color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Your Company SRL"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Company IDNO
              </label>
              <div style={{position: 'relative'}}>
                <User color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="text"
                  value={formData.idno}
                  onChange={(e) => handleInputChange('idno', e.target.value)}
                  placeholder="1234567890123"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Email Address
              </label>
              <div style={{position: 'relative'}}>
                <Mail color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@yourcompany.md"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Password
              </label>
              <div style={{position: 'relative'}}>
                <Lock color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Confirm Password
              </label>
              <div style={{position: 'relative'}}>
                <Lock color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                ...styles.btnPrimary,
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleInitialLogin}>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Company IDNO
              </label>
              <div style={{position: 'relative'}}>
                <Building color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="text"
                  value={formData.idno}
                  onChange={(e) => handleInputChange('idno', e.target.value)}
                  placeholder="1234567890123"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Email Address
              </label>
              <div style={{position: 'relative'}}>
                <Mail color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@company.com"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Password
              </label>
              <div style={{position: 'relative'}}>
                <Lock color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  style={{...styles.input, paddingLeft: '40px'}}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                ...styles.btnPrimary,
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '16px',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* MFA Verification Form */}
        {mode === 'mfa' && (
          <form onSubmit={handleMFAVerification}>
            <div style={{textAlign: 'center', marginBottom: '24px'}}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f0f9ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Mail color="#3b82f6" size={32} />
              </div>
              <h3 style={{fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '8px'}}>
                Check your email
              </h3>
              <p style={{fontSize: '14px', color: '#64748b', lineHeight: 1.5}}>
                We've sent a verification code to<br />
                <strong>{formData.email}</strong>
              </p>
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                Verification Code
              </label>
              <input
                type="text"
                value={formData.mfaCode}
                onChange={(e) => handleInputChange('mfaCode', e.target.value)}
                placeholder="Enter 6-digit code"
                style={{
                  ...styles.input,
                  textAlign: 'center',
                  fontSize: '18px',
                  letterSpacing: '2px'
                }}
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || formData.mfaCode.length !== 6}
              style={{
                ...styles.btn,
                ...styles.btnPrimary,
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '16px',
                opacity: (loading || formData.mfaCode.length !== 6) ? 0.6 : 1
              }}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div style={{textAlign: 'center', marginTop: '16px'}}>
              <button
                type="button"
                onClick={resendMFACode}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Didn't receive code? Resend
              </button>
            </div>
          </form>
        )}

        {/* Toggle Button */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{textAlign: 'center', marginTop: '16px'}}>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {mode === 'login' 
                ? "Don't have an account? Create one" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;