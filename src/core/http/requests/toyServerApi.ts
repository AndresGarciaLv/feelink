// src/core/http/requests/toyServerApi.ts
import { serverApi } from "../serverApi";
import { buildQueryParams } from "../../composables/httpComposables";

// --- DTOs PARA JUGUETES ---
export interface ToyDto {
  id: string;
  name: string;
  macAddress: string;
  patientId: string;
  // Agrega otros campos que devuelva tu API
}

export interface ToyCreateDto {
  name: string;
  macAddress: string;
  patientId: string;
}

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

// Interfaz para los parámetros de la consulta de resumen de lecturas del juguete
interface GetToyReadingsSummaryParams {
  macAddress: string;
  from: string; // Formato "YYYY-MM-DD"
  to: string;   // Formato "YYYY-MM-DD"
  dummy?: boolean;
}

export const toyServerApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    // --- ENDPOINT PARA CREAR JUGUETES ---
    createToy: builder.mutation<ToyDto, ToyCreateDto>({
      query: (body) => ({
        url: "Toys",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Toy"],
    }),
    
    // --- ENDPOINT PARA LISTAR JUGUETES--
    listToys: builder.query<ToyDto[], void>({
      query: () => "Toys",
      providesTags: ["Toy"],
    }),
    
    // --- ENDPOINT PARA ELIMINAR JUGUETES ---
    deleteToy: builder.mutation<void, string>({
      query: (id) => ({
        url: `Toys/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Toy"],
    }),
    
    // --- ENDPOINT EXISTENTE PARA EL RESUMEN DE LECTURAS DEL JUGUETE ---
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
  useCreateToyMutation, // juguetes
  useListToysQuery,     // listar juguetes
  useDeleteToyMutation, // eliminar juguetes
  useGetToyReadingsSummaryQuery, // Hook existente
} = toyServerApi;