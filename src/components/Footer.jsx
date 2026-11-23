import React from 'react';
import { ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer-root">
      {/* Value props banner */}
      <div className="features-banner">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon"><Truck size={24} /></div>
            <div>
              <h4 className="feature-title">Free Worldwide Shipping</h4>
              <p className="feature-desc">On all orders over $50.00</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <div>
              <h4 className="feature-title">100% Secure Checkout</h4>
              <p className="feature-desc">Encrypted with standard SSL</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><RefreshCw size={24} /></div>
            <div>
              <h4 className="feature-title">30-Day Money Back</h4>
              <p className="feature-desc">Hassle-free easy returns</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Clock size={24} /></div>
            <div>
              <h4 className="feature-title">24/7 Dedicated Support</h4>
              <p className="feature-desc">Friendly customer service</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; {CURRENT_YEAR} ApexStore E-Commerce Application to make a better shopping experience.
           Developed by Fatema Akter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
