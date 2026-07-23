"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/BottomNav';

export default function Profile() {
  const { user, profile, loading, signIn, signOut } = useAuth();
  const router = useRouter();

  // Login form state (inline when not logged in)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    const { error } = await signIn(email, password);
    setLoginLoading(false);
    if (error) setLoginError(error);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="mobile-wrapper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '60vh', color: '#A0A0A0' }}>
          Loading...
        </div>
        <BottomNav activePage="profile" />
      </div>
    );
  }

  // Not logged in — show login form
  if (!user) {
    return (
      <div className="mobile-wrapper">
        <main className="main-content auth-page">
          <img src="/assets/logo-homy.svg" alt="Homy Logo" className="auth-logo" />
          
          <h1 className="auth-title">Login existing account</h1>
          <p className="auth-subtitle">Welcome back! Log in to get started.</p>

          {loginError && (
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
              {loginError}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
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

            <button type="submit" className="auth-submit-btn" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
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

  // Logged in — show profile
  const displayName = profile?.full_name || user.user_metadata?.full_name || 'User';
  const displayEmail = profile?.email || user.email || '';

  return (
    <div className="mobile-wrapper">
      <header className="page-header" style={{ textAlign: 'center' }}>
        <h2 className="page-title">My Profile</h2>
      </header>

      <main className="main-content">
        <section className="profile-info-section">
          <div className="profile-avatar">
            <i className="ph-fill ph-user"></i>
          </div>
          <h3 className="profile-name">{displayName}</h3>
          <p className="profile-email">{displayEmail}</p>
          <button className="edit-profile-btn">Edit Profile</button>
        </section>

        <section className="profile-menu-section">
          <h4 className="menu-section-title">Orders</h4>
          <ul className="profile-menu-list">
            <li className="profile-menu-item">
              <Link href="/orders" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', textDecoration: 'none' }}>
                <div className="menu-item-left">
                  <i className="ph-fill ph-shopping-bag"></i>
                  <span>My Orders</span>
                </div>
                <i className="ph ph-caret-right"></i>
              </Link>
            </li>
            <li className="profile-menu-item">
              <div className="menu-item-left">
                <i className="ph-fill ph-map-pin"></i>
                <span>Shipping Address</span>
              </div>
              <i className="ph ph-caret-right"></i>
            </li>
            <li className="profile-menu-item">
              <div className="menu-item-left">
                <i className="ph-fill ph-credit-card"></i>
                <span>Payment Methods</span>
              </div>
              <i className="ph ph-caret-right"></i>
            </li>
          </ul>

          <h4 className="menu-section-title" style={{ marginTop: '24px' }}>Other</h4>
          <ul className="profile-menu-list">
            <li className="profile-menu-item">
              <div className="menu-item-left">
                <i className="ph-fill ph-gear"></i>
                <span>Setting</span>
              </div>
              <i className="ph ph-caret-right"></i>
            </li>
            <li className="profile-menu-item logout-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <div className="menu-item-left">
                <i className="ph-fill ph-sign-out"></i>
                <span>Log Out</span>
              </div>
              <i className="ph ph-caret-right"></i>
            </li>
          </ul>
        </section>
      </main>

      <BottomNav activePage="profile" />
    </div>
  );
}
