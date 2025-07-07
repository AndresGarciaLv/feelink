import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {extractRoleFromToken} from "../composables/authComposables";
import {RootState} from "../stores/store";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {AuthResponse} from "../contracts/auth/authResponse";
import {login, logout} from "../stores/auth/authSlice";
import Constants from 'expo-constants';

const baseQuery = fetchBaseQuery({
    baseUrl: Constants.expoConfig?.extra?.apiUrl,
    timeout: 15000,
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const state = getState() as RootState
        const token = state.auth.accessToken;
        headers.set("Accept", "application/json");
        headers.set("Content-Type", "application/json");
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const refreshResult = await baseQuery(
            {url: "auth/refresh-token", method: "POST"},
            api,
            extraOptions
        ) as { data: AuthResponse };

        if (refreshResult.data) {
            const {accessToken, ...userData} = refreshResult.data;
            api.dispatch(
                login({
                    user: {...userData},
                    role: extractRoleFromToken(accessToken),
                    accessToken: accessToken,
                })
            );
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }
    return result;
};

export const serverApi = createApi({
    reducerPath: "serverApi",
    keepUnusedDataFor: 30,
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: ["User", "Assets", "Auth", "Patient", "Toy"],
});