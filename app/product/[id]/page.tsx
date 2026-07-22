import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getProductById } from '../../../lib/products';
import AddToCartBar from './AddToCartBar';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mobile-wrapper">
      <div className={styles.pageContainer}>
        
        {/* Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.backBtn}>
            <i className="ph ph-arrow-left"></i> Back
          </Link>
          <button className={styles.cartBtn}>
            <i className="ph ph-shopping-cart"></i> 0
          </button>
        </header>

        {/* Product Info */}
        <div className={styles.productInfo}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{product.name}</h1>
            <i className={`ph ph-heart ${styles.heartIcon}`}></i>
          </div>
          <p className={styles.price}>{product.price}</p>
        </div>

        {/* 3D Model Viewer */}
        <div className={styles.modelContainer}>
          {React.createElement('model-viewer', {
            src: product.glb,
            'camera-controls': true,
            'auto-rotate': true,
            className: styles.modelViewer
          })}
        </div>

        {/* Description */}
        <div className={styles.descriptionSection}>
          <h2 className={styles.descTitle}>Description</h2>
          <p className={styles.descText}>
            {product.description}
          </p>
        </div>

        <AddToCartBar />
      </div>
    </div>
  );
}
