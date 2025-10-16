import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;