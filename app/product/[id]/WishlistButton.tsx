"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useWishlist } from '../../../context/WishlistContext';
import pageStyles from './page.module.css';
import popupStyles from './AddToCartBar.module.css';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
  };
}

export default function WishlistButton({ product }: WishlistButtonProps) {
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <i 
        className={`${inWishlist ? 'ph-fill ph-heart' : 'ph ph-heart'} ${pageStyles.heartIcon}`} 
        onClick={handleToggleWishlist}
        style={{ color: inWishlist ? '#FF4D4F' : '#1C2730' }}
      ></i>

      {mounted && showPopup && createPortal(
        <div className={popupStyles.overlay} onClick={closePopup}>
          <div className={popupStyles.popup} onClick={(e) => e.stopPropagation()}>
            <button className={popupStyles.closeBtnInner} onClick={closePopup}>
              <i className="ph ph-x"></i>
            </button>
            <img src="/assets/illustration/added wishlist.svg" alt="Added to Wishlist" className={popupStyles.illustration} />
            <h3 className={popupStyles.successTitle}>Added to Wishlist</h3>
            <p className={popupStyles.successText}>
              Your item was successfully added to your wishlist.<br />Continue shopping or view your wishlist.
            </p>
            <button className={popupStyles.viewCartBtn} onClick={() => { closePopup(); router.push('/wishlist'); }}>
              View Wishlist
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
