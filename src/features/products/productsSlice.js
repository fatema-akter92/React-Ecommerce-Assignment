import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAllProducts, fetchCategories, fetchProductById } from '../../services/api';

// Async thunk to fetch all products
export const getProducts = createAsyncThunk('products/getProducts', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchAllProducts();
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch products');
  }
});

// Async thunk to fetch categories
export const getCategories = createAsyncThunk('products/getCategories', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchCategories();
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch categories');
  }
});

// Async thunk to fetch single product details
export const getProductDetails = createAsyncThunk('products/getProductDetails', async (id, { rejectWithValue }) => {
  try {
    const data = await fetchProductById(id);
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to load product details');
  }
});

const initialState = {
  items: [],
  categories: [],
  selectedProduct: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  detailsStatus: 'idle',
  error: null,
  detailsError: null,
  // Filter and Sort states
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'default', // 'default' | 'price-asc' | 'price-desc' | 'rating-desc'
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'all';
      state.sortBy = 'default';
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.detailsStatus = 'idle';
      state.detailsError = null;
    },
  },
  extraReducers: (builder) => {
    // getProducts
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred while fetching products.';
      });

    // getCategories
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });

    // getProductDetails
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.detailsStatus = 'loading';
        state.detailsError = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.detailsError = action.payload || 'Failed to load product details.';
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  resetFilters,
  clearSelectedProduct,
} = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectCategories = (state) => state.products.categories;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSortBy = (state) => state.products.sortBy;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectDetailsStatus = (state) => state.products.detailsStatus;
export const selectDetailsError = (state) => state.products.detailsError;

// Derived filtered and sorted products selector
export const selectFilteredProducts = (state) => {
  const { items, searchQuery, selectedCategory, sortBy } = state.products;

  let result = [...items];

  // 1. Filter by category
  if (selectedCategory && selectedCategory !== 'all') {
    result = result.filter(
      (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  // 2. Search by name (product title)
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }

  // 3. Sort products
  if (sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating-desc') {
    result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
  }

  return result;
};

export default productsSlice.reducer;
