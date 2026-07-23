"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './page.module.css';
import { supabase } from '../../../lib/supabase';

interface OrderItem {
  id: number;
  product_id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  qty: number;
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function OrderDetail() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', parseInt(orderId))
        .single();

      if (!error && data) {
        setOrder(data as Order);
      }
      setLoading(false);
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace(/\s/g, '');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

  if (loading) {
    return (
      <div className="mobile-wrapper">
        <div className={styles.pageContainer}>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#A0A0A0' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mobile-wrapper">
        <div className={styles.pageContainer}>
          <header className={styles.header}>
            <Link href="/orders" className={styles.backBtn}>
              <i className="ph ph-arrow-left"></i> Back
            </Link>
          </header>
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#A0A0A0' }}>Order not found</div>
        </div>
      </div>
    );
  }

  const visibleItems = order.order_items.slice(0, 2);
  const hiddenCount = order.order_items.length > 2 ? order.order_items.length - 2 : 0;

  return (
    <div className="mobile-wrapper">
      <div className={styles.pageContainer}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/orders" className={styles.backBtn}>
            <i className="ph ph-arrow-left"></i> Back
          </Link>
        </header>

        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>Detail Order</h1>
          <span className={`${styles.badge} ${styles.badgePending}`}>
            <i className="ph-fill ph-clock"></i> {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Order Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Order Information</h2>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Order ID</span>
            <span className={styles.infoValue}>#{order.id}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Order Date</span>
            <span className={styles.infoValue}>{formatDate(order.created_at)}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Payment Status</span>
            <span className={styles.paymentBadge}>{getStatusLabel(order.status)}</span>
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        {/* Shipping Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Information</h2>
          <div className={styles.shippingBox}>
            <h3 className={styles.shippingName}>{order.shipping_name}</h3>
            <p className={styles.shippingAddress}>
              {order.shipping_address}<br/>
              {order.shipping_city} {order.shipping_zip}
            </p>
          </div>
        </section>

        <hr className={styles.sectionDivider} />

        {/* Detail Items */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Detail Items</h2>
          
          {visibleItems.map((item) => (
            <div className={styles.itemCard} key={item.id}>
              <div className={styles.imageBox}>
                <img src={item.product_image} alt={item.product_name} className={styles.itemImg} />
              </div>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemName}>{item.product_name}</h3>
                <p className={styles.itemPrice}>{item.product_price}</p>
              </div>
              <span className={styles.itemQty}>x{item.qty}</span>
            </div>
          ))}

          {hiddenCount > 0 && (
            <button className={styles.showMoreBtn}>
              Show {hiddenCount} more product <i className="ph ph-caret-down"></i>
            </button>
          )}
        </section>

        <hr className={styles.sectionDivider} />

        {/* Summary */}
        <section className={styles.summarySection}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Sub Total</span>
            <span className={styles.summaryValue}>{formatPrice(order.total_price)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Discount</span>
            <span className={styles.summaryValueRed}>-Rp0</span>
          </div>
          <hr className={styles.dashedLine} />
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total Price</span>
            <span className={styles.totalValue}>{formatPrice(order.total_price)}</span>
          </div>
        </section>

        {/* Bottom Bar */}
        {order.status === 'pending' && (
          <div className={styles.bottomBar}>
            <button className={styles.payBtn}>Pay Now</button>
          </div>
        )}
      </div>
    </div>
  );
}
