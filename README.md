# ApexStore - Modern E-Commerce Shopping Application

A high-performance, responsive E-Commerce web application built with **React.js**, **Redux Toolkit**, and **React Router**, powered by live data from the **FakeStore API**.

---

------

#### Live Project Link: 

-------



## 2. Project Description
ApexStore is a full-featured, production-ready shopping application developed to fulfill all requirements and bonus features of the **E-Commerce Shopping Application** assignment. Users can seamlessly browse a product catalog fetched via the FakeStore API, inspect full product specifications, instantly search by name, filter by category, sort by price and ratings, manage an interactive shopping cart with live item counts, and complete a simulated checkout workflow.

All shopping cart and application states are managed using **Redux Toolkit** with automatic persistence in `localStorage`.

---

## 3. Technologies Used
- **Frontend Framework:** React 19 / React.js
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`) & React Redux (`react-redux`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Build Tool & Bundler:** Vite 6
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Modern Responsive CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Responsive Media Queries)
- **API Endpoints:**
  - Products: `https://fakestoreapi.com/products`
  - Categories: `https://fakestoreapi.com/products/categories`
- **Storage:** Web Storage API (`localStorage`)

---

## 4. Main Features

### A. Home Page (`/`)
- **API Integration:** Fetches real-time products from `https://fakestoreapi.com/products` using Redux `createAsyncThunk`.
- **Product Card Display:** Shows product image, title, category pill, customer star ratings with review counts, formatted price (`$XX.XX`), quick wishlist toggle, and "Add to Cart" button.
- **Responsive Layout:** Adaptive CSS Grid (1 column on mobile, 2 columns on tablets, 3 to 4 columns on desktop displays).
- **Loading State:** Shimmer skeleton cards during data fetching.
- **Error Handling:** Robust error state with user-friendly retry button and offline fallback cache.

### B. Product Details Page (`/product/:id`)
- **Dynamic Routing:** Navigates using React Router (`useParams`).
- **Complete Information:** High-resolution product image, title, category, description, and review score.
- **Interactive Controls:** Quantity stepper selector (`+` / `-`), "Add to Cart" button with animated feedback, and "Buy Now" button.
- **Related Recommendations:** Automatically recommends items from the same category.
- **Breadcrumbs:** Quick navigation back to Home or Categories.

### C. Search & Filter Functionality
- **Instant Search:** Search products by title in real-time with instant clear button.
- **Category Filter:** Filter by categories (`electronics`, `jewelery`, `men's clothing`, `women's clothing`, or `All Products`).
- **Sorting Options:**
  - Price: Low to High
  - Price: High to Low
  - Customer Rating (Highest Rated)
  - Default / Featured
- **Active Filter Summary:** Item count indicator (`Showing X of Y items`) and "Reset Filters" button.

### D. Shopping Cart (`/cart`)
- **Full Redux Toolkit Implementation:**
  1. `addToCart`: Add products or increment item counts.
  2. `removeFromCart`: Remove single items.
  3. `increaseQuantity`: Increment item count.
  4. `decreaseQuantity`: Decrement item count (removes item if quantity hits 0).
  5. `clearCart`: Clear all cart items at once.
- **Order Calculation:**
  - Real-time Subtotal calculation
  - Estimated Sales Tax (8%)
  - Free Shipping progress bar (Free for orders > $50.00, otherwise $9.99)
  - Promo code discounts (e.g., enter `SAVE10` for 10% off)
  - Total amount calculation
- **Empty Cart State:** Clean vector graphic and direct call-to-action to browse items.

### E. Responsive Navigation Bar
- Application Logo & branding (`ApexStore`).
- Navigation links (`Home`, `Cart`, `Wishlist`, `Profile`).
- Real-time **Cart Item Count Badge** that automatically increments/decrements as items are added or removed (using `useSelector(selectCartTotalCount)`).
- Wishlist Item Count Badge.
- User Profile avatar and name indicator in navbar.
- Mobile drawer menu with smooth toggle.

### F. User Profile & Address Management (`/profile`)
- **Personal Information:** View and edit full name, email address, phone number, and custom avatar URL with instant LocalStorage sync.
- **Saved Delivery Addresses:** Manage multiple shipping addresses (Home, Office, Vacation, etc.), add new addresses with modal form, set default shipping address, and delete addresses.
- **Order History & Invoices:** Complete historical log of all placed orders including Order ID, date, status tag (Delivered / Processing), item list with photos, delivery destination, and one-click "Reorder" capability.
- **Integrated Checkout:** Seamless 1-click address selector at `/checkout` populated directly from the user's saved profile addresses. Placed orders immediately write to the profile's Order History.

---







