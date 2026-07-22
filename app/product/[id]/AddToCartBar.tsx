"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './AddToCartBar.module.css';

export default function AddToCartBar() {
  const [qty, setQty] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMinus = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handlePlus = () => {
    setQty(qty + 1);
  };

  const handleAddToCart = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className={styles.actionBar}>
        <div className={styles.qtySelector}>
          <button className={styles.qtyBtn} onClick={handleMinus}>
            <i className="ph ph-minus-circle"></i>
          </button>
          <span className={styles.qtyValue}>{qty}</span>
          <button className={styles.qtyBtn} onClick={handlePlus}>
            <i className="ph ph-plus-circle"></i>
          </button>
        </div>
        <button className={styles.addToCart} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      {mounted && showPopup && createPortal(
        <div className={styles.overlay} onClick={closePopup}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtnInner} onClick={closePopup}>
              <i className="ph ph-x"></i>
            </button>
            <img src="/assets/illustration/add cart.svg" alt="Success Illustration" className={styles.illustration} />
            <h3 className={styles.successTitle}>Added succesfully</h3>
            <p className={styles.successText}>
              Your items succesful added.<br />continue shopping or go to cart to<br />view your shopping list
            </p>
            <button className={styles.viewCartBtn} onClick={closePopup}>
              View Cart
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
