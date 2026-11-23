import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'redux_ecommerce_user_profile';

const defaultUserData = {
  profile: {
    fullName: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'January 2024',
  },
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      fullName: 'Alex Morgan',
      phone: '+1 (555) 234-5678',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'Oregon',
      zip: '97477',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      fullName: 'Alex Morgan',
      phone: '+1 (555) 987-6543',
      street: '100 Silicon Parkway, Suite 500',
      city: 'Tech Valley',
      state: 'California',
      zip: '94016',
      isDefault: false,
    },
  ],
  orders: [
    {
      orderId: 'APX-782910',
      date: '2026-11-15',
      status: 'Delivered',
      items: [
        {
          id: 1,
          title: 'Fjallraven - Foldsack No. 1 Backpack',
          price: 109.95,
          quantity: 1,
          image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
        },
      ],
      total: 118.75,
      deliveryAddress: '742 Evergreen Terrace, Springfield, Oregon 97477',
    },
  ],
};

const loadUserFromStorage = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return defaultUserData;
    const parsed = JSON.parse(serialized);
    return {
      profile: { ...defaultUserData.profile, ...parsed.profile },
      addresses: parsed.addresses || defaultUserData.addresses,
      orders: parsed.orders || defaultUserData.orders,
    };
  } catch (err) {
    console.error('Failed to load user state from localStorage', err);
    return defaultUserData;
  }
};

const saveUserToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save user state to localStorage', err);
  }
};

const initialState = loadUserFromStorage();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      saveUserToStorage(state);
    },
    addAddress: (state, action) => {
      const newAddress = {
        ...action.payload,
        id: 'addr-' + Date.now(),
        isDefault: state.addresses.length === 0 ? true : Boolean(action.payload.isDefault),
      };

      if (newAddress.isDefault) {
        state.addresses.forEach((a) => (a.isDefault = false));
      }

      state.addresses.push(newAddress);
      saveUserToStorage(state);
    },
    updateAddress: (state, action) => {
      const { id, ...updatedFields } = action.payload;
      const index = state.addresses.findIndex((a) => a.id === id);
      if (index !== -1) {
        if (updatedFields.isDefault) {
          state.addresses.forEach((a) => (a.isDefault = false));
        }
        state.addresses[index] = { ...state.addresses[index], ...updatedFields };
        saveUserToStorage(state);
      }
    },
    deleteAddress: (state, action) => {
      const id = action.payload;
      const deletedWasDefault = state.addresses.find((a) => a.id === id)?.isDefault;
      state.addresses = state.addresses.filter((a) => a.id !== id);
      if (deletedWasDefault && state.addresses.length > 0) {
        state.addresses[0].isDefault = true;
      }
      saveUserToStorage(state);
    },
    setDefaultAddress: (state, action) => {
      const id = action.payload;
      state.addresses.forEach((a) => {
        a.isDefault = a.id === id;
      });
      saveUserToStorage(state);
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      saveUserToStorage(state);
    },
  },
});

export const {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  addOrder,
} = userSlice.actions;

export const selectUserProfile = (state) => state.user.profile;
export const selectUserAddresses = (state) => state.user.addresses;
export const selectUserDefaultAddress = (state) =>
  state.user.addresses.find((a) => a.isDefault) || state.user.addresses[0];
export const selectUserOrders = (state) => state.user.orders;

export default userSlice.reducer;
