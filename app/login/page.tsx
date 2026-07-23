"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);
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
        
        <h1 className="auth-title">Login existing account</h1>
        <p className="auth-subtitle">Welcome back! Log in to get started.</p>

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
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Input your credential password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have account? <Link href="/register" className="auth-link">Sign Up</Link>
        </div>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
}
