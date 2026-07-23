"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  activePage?: 'home' | 'cart' | 'wishlist' | 'profile';
}

export default function BottomNav({ activePage }: BottomNavProps) {
  const { user, loading } = useAuth();

  return (
    <nav className="bottom-nav">
      <Link href="/" className={`nav-item ${activePage === 'home' ? 'active' : ''}`}>
        <i className={`${activePage === 'home' ? 'ph-fill' : 'ph'} ph-house`}></i>
        {activePage === 'home' && <span className="nav-label">Home</span>}
      </Link>
      <Link href="/cart" className={`nav-item ${activePage === 'cart' ? 'active' : ''}`}>
        <i className={`${activePage === 'cart' ? 'ph-fill' : 'ph'} ph-shopping-cart`}></i>
        {activePage === 'cart' && <span className="nav-label">Cart</span>}
      </Link>
      <Link href="/wishlist" className={`nav-item ${activePage === 'wishlist' ? 'active' : ''}`}>
        <i className={`${activePage === 'wishlist' ? 'ph-fill' : 'ph'} ph-heart`}></i>
        {activePage === 'wishlist' && <span className="nav-label">Wishlist</span>}
      </Link>
      <Link href="/profile" className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}>
        {!loading && user ? (
          <i className={`ph-fill ph-user-circle`} style={activePage !== 'profile' ? { color: '#1C2730' } : {}}></i>
        ) : (
          <i className={`${activePage === 'profile' ? 'ph-fill' : 'ph'} ph-user`}></i>
        )}
        {activePage === 'profile' && <span className="nav-label">Profile</span>}
      </Link>
    </nav>
  );
}
