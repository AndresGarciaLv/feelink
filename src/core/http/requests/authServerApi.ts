import {serverApi} from "../serverApi";
import {AuthResponse} from "../../contracts/auth/authResponse";
import {RegisterDto} from "../../contracts/auth/registerDto";
import {LoginDto} from "../../contracts/auth/loginDto";
import {ChangePasswordDto} from "../../contracts/auth/changePasswordDto";


export const authServerApi = serverApi.injectEndpoints({
    endpoints: (builder) => ({

        register: builder.mutation<AuthResponse, RegisterDto>({
            query: (newUser) => ({
                url: 'Auth/register',
                method: 'POST',
                body: newUser,
            })
        }),

        login: builder.mutation<AuthResponse, LoginDto>({
            query: (credentials) => ({
                url: 'Auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'Auth/logout',
                method: 'POST'
            }),
            invalidatesTags: ["Auth", "User"]
        }),

        token: builder.query<AuthResponse, void>({
            query: () => `Auth/refresh-token`,
            providesTags: ["Auth", "User"]
        }),

        refreshToken: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: `Auth/refresh-token`,
                method: 'POST'
            }),
            invalidatesTags: ["Auth", "User"]
        }),

        googleLogin: builder.mutation<AuthResponse, string>({
            query: (credential) => ({
                url: 'Auth/google-login',
                method: 'POST',
                body: {credential: credential},
            }),
        }),

        changePassword: builder.mutation<AuthResponse, ChangePasswordDto>({
            query: (request) => ({
                url: 'Auth/change-password',
                method: 'POST',
                body: request
            })
        })
    }),
    overrideExisting: false,
})
export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGoogleLoginMutation,
    useChangePasswordMutation,
    useTokenQuery,
    useLazyTokenQuery,
    useRefreshTokenMutation,
} = authServerApi
