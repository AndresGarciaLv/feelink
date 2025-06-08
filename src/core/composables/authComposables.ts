import {jwtDecode} from "jwt-decode";
import {AuthPayLoad, AuthState} from "../types/auth";
import {AuthResponse} from "../contracts/auth/authResponse";

/**
 * Extrae los permisos del token, se reciben en formato de objeto agrupado por modulo, tienen la sig estructura:
 *
 * '{
 *     'modulo1': ['permiso1', 'permiso2'],
 *     "modulo2": ['permiso3', 'permiso4'],
 *     ...
 * }'
 *
 * @param token
 * @returns permissions
 */
export function extractRoleFromToken(token: string): string {
    try {
        const payload = jwtDecode<AuthPayLoad>(token);
        console.log("Payload:", payload);
        return payload.role;
    } catch (error) {
        console.error("Error decoding token:", error);
        return '';
    }
}

export function buildAuthStateFromResponse(response: AuthResponse) : AuthState {
    return {
        userData: {
            id: response.id,
            name: response.name,
            email: response.email,
        },
        isAuthenticated: true,
        accessToken: response.accessToken,
        role: extractRoleFromToken(response.accessToken),
        isAuthLoading: false
    };
}