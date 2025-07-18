// src/core/stores/store.ts
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import {serverApi} from "../http/serverApi";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import wifiReducer from "./wifi/wifiSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        wifi:wifiReducer,
        [serverApi.reducerPath]: serverApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(serverApi.middleware)
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store;