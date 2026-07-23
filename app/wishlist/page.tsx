"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import BottomNav from '../../components/BottomNav';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = wishlistItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mobile-wrapper">
      <header className="page-header">
        <h2 className="page-title">My Wishlist</h2>
      </header>

      <main className="main-content">
        {wishlistItems.length === 0 ? (
          <div className="empty-state">
            <img src="/assets/illustration/wishlist-empty.svg" alt="Empty Wishlist" className="empty-illustration" />
            <h3 className="empty-title">No favorites yet</h3>
            <p className="empty-subtitle">
              Your wishlist is empty! Start exploring and add items you love.
            </p>
            <Link href="/" className="primary-btn">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="wishlist-content">
            <div className="search-section">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search item from wishlist..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="ph ph-magnifying-glass search-icon"></i>
              </div>
            </div>

            <div className="products-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="product-card wishlist-card">
                  <div className="product-image-container">
                    <img src={item.image} alt={item.name} className="product-image" />
                  </div>
                  <h4 className="product-name">{item.name}</h4>
                  <p className="product-price">{item.price}</p>
                  
                  <div className="wishlist-card-actions">
                    <button 
                      className="wishlist-add-btn"
                      onClick={() => addToCart(item, 1)}
                    >
                      <i className="ph ph-shopping-cart"></i> Add
                    </button>
                    <button 
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <i className="ph ph-trash"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav activePage="wishlist" />
    </div>
  );
}
