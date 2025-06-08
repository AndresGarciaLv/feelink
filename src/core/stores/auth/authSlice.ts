import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";
import {AuthState, UserData} from "../../types/auth";

const initialState: AuthState = {
    userData: null,
    isAuthenticated: false,
    accessToken: null,
    role: null,
    isAuthLoading: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ user: UserData; accessToken: string; role: string }>) => {
            state.userData = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.role = action.payload.role;
            state.isAuthenticated = true;
            state.isAuthLoading = false;
        },
        logout: (state) => {
            state.userData = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.role = null;
            state.isAuthLoading = false;
        },
        setAuthState: (state, action) => {
            Object.assign(state, action.payload);
        },
    }
});

export const { login, logout, setAuthState } = authSlice.actions;

// Selectors
export const selectUserData = (state: RootState) => state.auth.userData;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectRole = (state: RootState) => state.auth.role;
export const selectIsAuthLoading = (state: RootState) => state.auth.isAuthLoading;

export default authSlice.reducer;