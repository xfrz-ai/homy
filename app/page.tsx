"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchProducts, type Product } from '../lib/products';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mobile-wrapper">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src="/assets/logo-homy.svg" alt="Homy Logo" />
        </div>
        <i className="ph ph-bell header-icon"></i>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-card">
            <div className="hero-content">
              <h2 className="hero-title">Levoit Air<br/>Purifier</h2>
              <p className="hero-price">Rp 1.250.000</p>
              <button className="hero-btn">Add to Cart</button>
            </div>
            <img src="/assets/hero/purifier 1.png" alt="Levoit Air Purifier" className="hero-image" />
            <div className="hero-pagination">
              <div className="dot active"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-box">
            <input type="text" placeholder="Search favorite product..." className="search-input" />
            <i className="ph ph-magnifying-glass search-icon"></i>
          </div>
        </section>

        {/* Products Section */}
        <section className="products-section">
          <div className="products-header">
            <h3 className="products-title">Products</h3>
            <a href="#" className="see-all">See all</a>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#A0A0A0' }}>Loading products...</div>
          ) : (
            <div className="products-grid">
              {products.map((product, index) => (
                <Link href={`/product/${product.id}`} key={index} className="product-card" style={{ textDecoration: 'none' }}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-price">{product.price}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav activePage="home" />
    </div>
  );
}
