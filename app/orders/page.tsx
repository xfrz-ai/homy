"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

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
  created_at: string;
  order_items: OrderItem[];
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'pending', icon: 'ph-clock', label: 'Pending' },
    { id: 'processed', icon: 'ph-hourglass-high', label: 'Processed' },
    { id: 'delivered', icon: 'ph-truck', label: 'Delivered' },
    { id: 'failed', icon: 'ph-x-circle', label: 'Failed' },
    { id: 'success', icon: 'ph-check-circle', label: 'Success' }
  ];

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

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

  const filteredOrders = orders.filter(o => o.status === activeTab);

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.badgePending;
      case 'processed': return styles.badgePending;
      case 'success': return styles.badgeSuccess;
      case 'failed': return styles.badgeFailed;
      default: return styles.badgePending;
    }
  };

  return (
    <div className="mobile-wrapper">
      <div className={styles.pageContainer}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/profile" className={styles.backBtn}>
            <i className="ph ph-arrow-left"></i> Back
          </Link>
        </header>
        <h1 className={styles.pageTitle}>My Orders</h1>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`ph-fill ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#A0A0A0' }}>Loading orders...</div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const firstItem = order.order_items[0];
              const otherCount = order.order_items.length - 1;
              return (
                <Link href={`/orders/${order.id}`} className={styles.orderCard} key={order.id}>
                  <div className={styles.cardHeader}>
                    <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                    <span className={`${styles.badge} ${getBadgeClass(order.status)}`}>
                      <i className={`ph-fill ${tabs.find(t => t.id === order.status)?.icon || 'ph-clock'}`}></i> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className={styles.paymentStatus}>
                    <span className={styles.paymentLabel}>Payment Status</span>
                    <span className={styles.paymentTime}>{order.status === 'pending' ? 'Pending' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>
                  <hr className={styles.dashedLine} />
                  
                  {firstItem && (
                    <div className={styles.orderItem}>
                      <div className={styles.imageBox}>
                        <img src={firstItem.product_image} alt={firstItem.product_name} className={styles.itemImg} />
                      </div>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>{firstItem.product_name}</h3>
                        <p className={styles.itemPrice}>{firstItem.product_price}</p>
                      </div>
                      <span className={styles.itemQty}>x{firstItem.qty}</span>
                    </div>
                  )}
                  {otherCount > 0 && (
                    <p className={styles.otherProduct}>+{otherCount} other product</p>
                  )}
                  
                  <hr className={styles.dashedLine} />
                  
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Total Price</span>
                    <span className={styles.totalPrice}>{formatPrice(order.total_price)}</span>
                  </div>
                </Link>
              );
            })
          ) : (
            /* Empty State */
            <div className={styles.emptyState}>
              <img src="/assets/illustration/order empty.svg" alt="Empty Orders" className={styles.emptyImg} />
              <h2 className={styles.emptyTitle}>No order history</h2>
              <p className={styles.emptyText}>
                You have no past orders. Explore our catalog and place your first order!
              </p>
              <Link href="/" className={styles.startShoppingBtn}>
                Start shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
