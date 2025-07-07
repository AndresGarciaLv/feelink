// src/core/http/requests/toyServerApi.ts
import { serverApi } from "../serverApi";
import { buildQueryParams } from "../../composables/httpComposables";

// --- NUEVO DTO PARA EL RESUMEN DE LECTURAS DEL JUGUETE ---
// Ajusta esta interfaz para que coincida con la respuesta real de tu backend
export interface ToyReadingsSummary {
  macAddress: string;
  from: string; // "YYYY-MM-DD"
  to: string;   // "YYYY-MM-DD"
  totalReadings: number;
  averageMetric: number; // Ejemplo: promedio de algún valor
  dailyReadings: DailyToyReading[];
}

export interface DailyToyReading {
  date: string; // "YYYY-MM-DD"
  value: number; // Ejemplo: un valor de métrica diaria
  emotions: string[]; // Ejemplo: ["Feliz", "Neutro"]
  // ... cualquier otro detalle diario que tu API devuelva
}
// --- FIN DEL NUEVO DTO ---


// Interfaz para los parámetros de la consulta de resumen de lecturas del juguete
interface GetToyReadingsSummaryParams {
  macAddress: string;
  from: string; // Formato "YYYY-MM-DD"
  to: string;   // Formato "YYYY-MM-DD"
  dummy?: boolean;
}

export const toyServerApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- NUEVO ENDPOINT PARA EL RESUMEN DE LECTURAS DEL JUGUETE ---
    getToyReadingsSummary: builder.query<ToyReadingsSummary, GetToyReadingsSummaryParams>({
      query: ({ macAddress, from, to, dummy }) => {
        const params = buildQueryParams({ From: from, To: to, Dummy: dummy });
        return `Toys/${macAddress}/readings/summary?${params}`;
      },
      providesTags: ["Toy"], // Considera una etiqueta más específica, ej: "ToyReadingsSummary"
    }),
    // --- FIN NUEVO ENDPOINT ---
  }),
  overrideExisting: false,
});

export const {
  useGetToyReadingsSummaryQuery, // Exporta el nuevo hook
} = toyServerApi;