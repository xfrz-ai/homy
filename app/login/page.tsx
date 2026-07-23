"use client";

import React from 'react';
import Link from 'next/link';

export default function Login() {
  return (
    <div className="mobile-wrapper">
      <main className="main-content auth-page">
        <img src="/assets/logo-homy.svg" alt="Homy Logo" className="auth-logo" />
        
        <h1 className="auth-title">Login existing account</h1>
        <p className="auth-subtitle">Welcome back! Log in to get started.</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="auth-form-group">
            <label className="auth-label">Email</label>
            <div className="auth-input-wrapper">
              <i className="ph-fill ph-envelope-simple auth-icon"></i>
              <input type="email" className="auth-input" placeholder="Input your registered email" />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <i className="ph-fill ph-lock-key auth-icon"></i>
              <input type="password" className="auth-input" placeholder="Input your credential password" />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">Sign In</button>
        </form>

        <div className="auth-footer">
          Don't have account? <Link href="/register" className="auth-link">Sign Up</Link>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <Link href="/" className="nav-item">
          <i className="ph ph-house"></i>
        </Link>
        <Link href="/cart" className="nav-item">
          <i className="ph ph-shopping-cart"></i>
        </Link>
        <Link href="/wishlist" className="nav-item">
          <i className="ph ph-heart"></i>
        </Link>
        <Link href="/profile" className="nav-item active">
          <i className="ph-fill ph-user"></i>
          <span className="nav-label">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
