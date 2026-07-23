"use client";

import React from 'react';
import Link from 'next/link';

export default function Profile() {
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
          <h3 className="profile-name">Dhimas Prio</h3>
          <p className="profile-email">dimasomnia22@gmail.com</p>
          <button className="edit-profile-btn">Edit Profile</button>
        </section>

        <section className="profile-menu-section">
          <h4 className="menu-section-title">Orders</h4>
          <ul className="profile-menu-list">
            <li className="profile-menu-item">
              <div className="menu-item-left">
                <i className="ph-fill ph-shopping-bag"></i>
                <span>My Orders</span>
              </div>
              <i className="ph ph-caret-right"></i>
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
            <li className="profile-menu-item logout-item">
              <div className="menu-item-left">
                <i className="ph-fill ph-sign-out"></i>
                <span>Log Out</span>
              </div>
              <i className="ph ph-caret-right"></i>
            </li>
          </ul>
        </section>
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
