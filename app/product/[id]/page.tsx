"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { fetchProductById, type Product } from '../../../lib/products';
import AddToCartBar from './AddToCartBar';
import CartButton from '../../../components/CartButton';
import WishlistButton from './WishlistButton';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductById(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mobile-wrapper">
        <div className={styles.pageContainer}>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#A0A0A0' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mobile-wrapper">
        <div className={styles.pageContainer}>
          <header className={styles.header}>
            <Link href="/" className={styles.backBtn}>
              <i className="ph ph-arrow-left"></i> Back
            </Link>
          </header>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#A0A0A0' }}>Product not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-wrapper">
      <div className={styles.pageContainer}>
        
        {/* Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.backBtn}>
            <i className="ph ph-arrow-left"></i> Back
          </Link>
          <CartButton className={styles.cartBtn} />
        </header>

        {/* Product Info */}
        <div className={styles.productInfo}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{product.name}</h1>
            <WishlistButton product={product} />
          </div>
          <p className={styles.price}>{product.price}</p>
        </div>

        {/* 3D Model Viewer */}
        {product.glb && (
          <div className={styles.modelContainer}>
            {React.createElement('model-viewer', {
              src: product.glb,
              'camera-controls': true,
              'auto-rotate': true,
              className: styles.modelViewer
            })}
          </div>
        )}

        {/* Description */}
        <div className={styles.descriptionSection}>
          <h2 className={styles.descTitle}>Description</h2>
          <p className={styles.descText}>
            {product.description}
          </p>
        </div>

        <AddToCartBar product={product} />
      </div>
    </div>
  );
}
