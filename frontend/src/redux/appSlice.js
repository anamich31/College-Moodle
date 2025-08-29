import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    isDarkMode: JSON.parse(localStorage.getItem("isDarkMode")) || false, // Load from localStorage
    loading: false,
    user: JSON.parse(localStorage.getItem("user")) || null, // Load from localStorage
  },
  reducers: {
    // Theme actions
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode)); // Persist theme state
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload; // Explicitly set theme
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode)); // Persist theme state
    },
    
    // User actions
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // Persist user data
    },
    
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Clear user from localStorage
    },

    // Loading actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setLoading, setUser, logoutUser } = appSlice.actions;
export default appSlice.reducer;
