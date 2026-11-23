import { createSlice } from '@reduxjs/toolkit';

// Load cart from LocalStorage if available (Bonus requirement)
const loadCartFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('redux_ecommerce_cart');
    if (serializedState === null) {
      return [];
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load cart from localStorage', err);
    return [];
  }
};

// Save cart to LocalStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('redux_ecommerce_cart', JSON.stringify(cartItems));
  } catch (err) {
    console.error('Could not save cart to localStorage', err);
  }
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 1. addToCart: Add a product to the shopping cart
    addToCart: (state, action) => {
      const product = action.payload;
      const quantityToAdd = product.quantity && product.quantity > 0 ? product.quantity : 1;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          category: product.category,
          image: product.image,
          quantity: quantityToAdd,
        });
      }
      saveCartToStorage(state.items);
    },

    // 2. removeFromCart: Remove a product from the shopping cart
    removeFromCart: (state, action) => {
      const idToRemove = action.payload;
      state.items = state.items.filter((item) => item.id !== idToRemove);
      saveCartToStorage(state.items);
    },

    // 3. increaseQuantity: Increase the quantity of a selected product
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity += 1;
      }
      saveCartToStorage(state.items);
    },

    // 4. decreaseQuantity: Decrease the quantity of a selected product
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // If quantity reaches 0, remove item from cart
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
      saveCartToStorage(state.items);
    },

    // 5. clearCart: Remove all products from the shopping cart
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotalCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
