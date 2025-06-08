export interface AuthResponse {
    id: string
    accessToken: string
    refreshToken: string
    email?: string
    googleAuth: boolean
    name: string
    firstLastName?: string
    secondLastName?: string
    picture?: string
}