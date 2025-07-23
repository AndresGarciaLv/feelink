import { jwtDecode } from "jwt-decode";
import { AuthPayLoad, AuthState, UserData } from "../types/auth";
import { AuthResponse } from "../contracts/auth/authResponse";


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
        return payload.role;
    } catch (error) {
        console.log("Error decoding token:", error);
        return '';
    }
}

export function extractPayloadFromToken(token: string): AuthPayLoad | null {
  try {
    const payload = jwtDecode<AuthPayLoad>(token);
    console.log("Payload decodificado:", payload);
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function buildAuthStateFromResponse(response: AuthResponse): AuthState {
  const payload = extractPayloadFromToken(response.accessToken);

  const userData: UserData = {
    id: payload?.nameid ?? '',         
    name: response.name ?? '',
    email: response.email ?? '',
    picture: response.picture ?? null,
  };

  return {
    userData,
    isAuthenticated: true,
    accessToken: response.accessToken,
    role: payload?.role ?? null,
    isAuthLoading: false,
  };
}


// export function buildAuthStateFromResponse(response: AuthResponse): AuthState {
//   const payload = extractPayloadFromToken(response.accessToken);

//   const userData: UserData = {
//     id: payload?.["nameid"] || "",
//     name: response.name,
//     email: response.email,
//     picture: response.picture,
//   };

//   return {
//     userData,
//     isAuthenticated: true,
//     accessToken: response.accessToken,
//     role: payload?.role ?? null,
//     isAuthLoading: false,
//   };
// }
