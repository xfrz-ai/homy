"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

export default function Register() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="mobile-wrapper">
      <main className="main-content auth-page">
        <img src="/assets/logo-homy.svg" alt="Homy Logo" className="auth-logo" />
        
        <h1 className="auth-title">Create free account</h1>
        <p className="auth-subtitle">Create an account in a few easy steps.</p>

        {error && (
          <div style={{ 
            backgroundColor: '#FFF2F2', 
            color: '#FF4D4F', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            fontSize: '13px', 
            width: '100%', 
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {typeof error === 'string' ? (error === '{}' ? 'An unexpected error occurred during registration.' : error) : JSON.stringify(error)}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Name</label>
            <div className="auth-input-wrapper">
              <i className="ph-fill ph-user auth-icon"></i>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Input your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrapper">
              <i className="ph-fill ph-envelope-simple auth-icon"></i>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Input your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <i className="ph-fill ph-lock-key auth-icon"></i>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Input credential password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Re-Type Password</label>
            <div className="auth-input-wrapper">
              <i className="ph-fill ph-lock-key auth-icon"></i>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Re-Type your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have account? <Link href="/login" className="auth-link">Sign In</Link>
        </div>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
}
