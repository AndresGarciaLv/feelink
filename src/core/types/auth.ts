export interface UserData {
    id: string
    name: string
    email?: string
    picture?: string;
}

export interface AuthState {
    userData: UserData | null
    isAuthenticated: boolean
    accessToken: string | null
    role: string | null
    isAuthLoading: boolean
}

export interface AuthPayLoad {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    nameId: string;
    jti: string;
    role: string
    userName: string
    exp: number; // Fecha de expiración como un timestamp en segundos
    iss: string; // Emisor
    aud: string; // Audiencia
}