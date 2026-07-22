"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, getTotalPrice } = useCart();
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

  const isEmpty = cartItems.length === 0;

  if (!mounted) {
    return null; // or a loading state
  }

  return (
    <div className="mobile-wrapper">
      <div className={styles.pageContainer}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/" className={styles.backBtn}>
            <i className="ph ph-arrow-left"></i> Back
          </Link>
          <h1 className={styles.title}>Shopping Cart</h1>
        </header>

        {isEmpty ? (
          /* Empty State */
          <div className={styles.emptyState}>
            <img src="/assets/illustration/cart empty.svg" alt="Empty Cart" className={styles.emptyIllustration} />
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Sadly your cart is currently empty.<br />Explore catalog & add items to your cart!
            </p>
            <Link href="/" className={styles.startShoppingBtn}>
              Start shopping
            </Link>
          </div>
        ) : (
          /* Filled State */
          <>
            <div className={styles.listHeader}>
              <h2 className={styles.listTitle}>Shopping List</h2>
              <Link href="/" className={styles.addItemBtn}>
                <i className="ph ph-plus-circle"></i> Add item
              </Link>
            </div>

            <div className={styles.cartList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemTop}>
                    <div className={styles.imageBox}>
                      <img src={item.image} alt={item.name} className={styles.itemImg} />
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemPrice}>{item.price}</p>
                    </div>
                  </div>
                  <div className={styles.itemBottom}>
                    <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                      <i className="ph ph-trash"></i> Remove
                    </button>
                    <div className={styles.qtyControl}>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}>
                        <i className="ph ph-minus-circle"></i>
                      </button>
                      <span className={styles.qtyValue}>{item.qty}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>
                        <i className="ph ph-plus-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.promoSection}>
              <div className={styles.promoBox}>
                <input type="text" placeholder="Input promo code..." className={styles.promoInput} />
                <button className={styles.promoApply}>Apply</button>
              </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className={styles.bottomBar}>
              <div className={styles.totalInfo}>
                <span className={styles.totalLabel}>Total Price</span>
                <span className={styles.totalPrice}>{formatPrice(getTotalPrice())}</span>
              </div>
              <button className={styles.checkoutBtn}>Continue Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
