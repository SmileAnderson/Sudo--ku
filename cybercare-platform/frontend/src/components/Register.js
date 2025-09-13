import React, { useState } from 'react';
import { Building, Mail, Lock, User } from 'lucide-react';
import { styles } from '../styles/styles';

const Register = ({ onRegister, switchToLogin }) => {
  const [formData, setFormData] = useState({
    idno: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idno: formData.idno,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName
        })
      });

      const data = await response.json();

      if (response.ok) {
        onRegister();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h1 style={{fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0'}}>
            Register Company
          </h1>
          <p style={{color: '#64748b', margin: 0}}>
            Create your CyberCare account
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>
              Company Name
            </label>
            <div style={{position: 'relative'}}>
              <Building color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                placeholder="Your Company SRL"
                style={{...styles.input, paddingLeft: '40px'}}
                required
              />
            </div>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>
              Company IDNO
            </label>
            <div style={{position: 'relative'}}>
              <User color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
              <input
                type="text"
                value={formData.idno}
                onChange={(e) => setFormData({...formData, idno: e.target.value})}
                placeholder="1234567890123"
                style={{...styles.input, paddingLeft: '40px'}}
                required
              />
            </div>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>
              Email Address
            </label>
            <div style={{position: 'relative'}}>
              <Mail color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="admin@yourcompany.md"
                style={{...styles.input, paddingLeft: '40px'}}
                required
              />
            </div>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>
              Password
            </label>
            <div style={{position: 'relative'}}>
              <Lock color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                style={{...styles.input, paddingLeft: '40px'}}
                required
              />
            </div>
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>
              Confirm Password
            </label>
            <div style={{position: 'relative'}}>
              <Lock color="#9ca3af" size={20} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)'}} />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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

        <div style={{textAlign: 'center', marginTop: '16px'}}>
          <button
            onClick={switchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;