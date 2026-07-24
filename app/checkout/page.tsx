"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// Midtrans Snap type declaration
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: Record<string, unknown>) => void;
          onPending?: (result: Record<string, unknown>) => void;
          onError?: (result: Record<string, unknown>) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

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

  const parsePrice = (priceStr: string) => {
    const cleaned = priceStr.replace(/Rp\s?/g, '').replace(/\./g, '');
    return parseInt(cleaned, 10) || 0;
  };

  const handlePayNow = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!fullName || !streetAddress || !city || !zipCode) {
      setError('Please fill in all shipping information.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Create order in Supabase (status: pending)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_price: getTotalPrice(),
          shipping_name: fullName,
          shipping_address: streetAddress,
          shipping_city: city,
          shipping_zip: zipCode,
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_image: item.image,
        qty: item.qty,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Get Snap token from our API
      const midtransItems = cartItems.map((item) => ({
        name: item.name,
        price: parsePrice(item.price),
        qty: item.qty,
      }));

      const snapResponse = await fetch('/api/midtrans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.id,
          gross_amount: getTotalPrice(),
          customer_name: fullName,
          customer_email: user.email,
          items: midtransItems,
        }),
      });

      const snapData = await snapResponse.json();

      if (!snapResponse.ok) {
        throw new Error(snapData.error || 'Failed to create payment');
      }

      // 4. Open Midtrans Snap popup
      if (!window.snap) {
        throw new Error('Payment system is loading. Please try again.');
      }

      window.snap.pay(snapData.snap_token, {
        onSuccess: async () => {
          // Update order status to paid
          await supabase
            .from('orders')
            .update({ status: 'paid' })
            .eq('id', orderData.id);

          clearCart();
          router.push(`/orders/${orderData.id}`);
        },
        onPending: () => {
          // Order stays pending, redirect to order detail
          clearCart();
          router.push(`/orders/${orderData.id}`);
        },
        onError: () => {
          setError('Payment failed. You can retry from your order details.');
          setSubmitting(false);
        },
        onClose: () => {
          setError('Payment cancelled. You can retry from your order details.');
          setSubmitting(false);
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to place order';
      setError(message);
      setSubmitting(false);
    }
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

        {error && (
          <div style={{ 
            margin: '0 20px 16px', 
            backgroundColor: '#FFF2F2', 
            color: '#FF4D4F', 
            padding: '12px 16px', 
            borderRadius: '12px', 
            fontSize: '13px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

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
            <input type="text" className={styles.input} placeholder="Ex: Ucok Baba" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Street Address</label>
            <textarea className={styles.textarea} placeholder="Ex: Jl. Jendral Sudirman No. 10" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}></textarea>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>City</label>
              <input type="text" className={styles.input} placeholder="Ex: Jakarta" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>Zip Code</label>
              <input type="text" className={styles.input} placeholder="Ex: 10220" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.totalInfo}>
            <span className={styles.totalLabel}>Total Price</span>
            <span className={styles.totalPrice}>{formatPrice(getTotalPrice())}</span>
          </div>
          <button className={styles.payBtn} onClick={handlePayNow} disabled={submitting}>
            {submitting ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
