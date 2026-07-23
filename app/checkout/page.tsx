"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useCart } from '../../context/CartContext';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace(/\s/g, '');
  };

  if (!mounted) return null;

  const firstItem = cartItems[0];
  const remainingCount = cartItems.length > 1 ? cartItems.length - 1 : 0;

  return (
    <div className="mobile-wrapper">
      <div className={styles.pageContainer}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/cart" className={styles.backBtn}>
            <i className="ph ph-arrow-left"></i> Back
          </Link>
        </header>

        <h1 className={styles.pageTitle}>Checkout</h1>

        {/* Detail Items */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Detail Items</h2>
          <div className={styles.detailBox}>
            {firstItem ? (
              <div className={styles.itemRow}>
                <div className={styles.imageBox}>
                  <img src={firstItem.image} alt={firstItem.name} className={styles.itemImg} />
                </div>
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{firstItem.name}</h3>
                  <p className={styles.itemPrice}>{firstItem.price}</p>
                </div>
                <span className={styles.itemQty}>x{firstItem.qty}</span>
              </div>
            ) : (
              <p className={styles.emptyText}>No items in checkout.</p>
            )}

            {cartItems.length > 1 && (
              <>
                <hr className={styles.dashedLine} />
                <button className={styles.showMoreBtn}>
                  Show {remainingCount} more product <i className="ph ph-caret-down"></i>
                </button>
              </>
            )}
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        {/* Shipping Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Information</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input type="text" className={styles.input} placeholder="Ex: Ucok Baba" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Street Address</label>
            <textarea className={styles.textarea} placeholder="Ex: Jl. Jendral Sudirman No. 10"></textarea>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>City</label>
              <input type="text" className={styles.input} placeholder="Ex: Jakarta" />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Zip Code</label>
              <input type="text" className={styles.input} placeholder="Ex: 10220" />
            </div>
          </div>
        </section>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.totalInfo}>
            <span className={styles.totalLabel}>Total Price</span>
            <span className={styles.totalPrice}>{formatPrice(getTotalPrice())}</span>
          </div>
          <button className={styles.payBtn}>Pay Now</button>
        </div>
      </div>
    </div>
  );
}
