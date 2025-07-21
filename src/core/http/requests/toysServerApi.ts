import { serverApi } from "../serverApi";
import BaseListResponse from "../../contracts/BaseListResponse";
import { buildQueryParams } from "../../composables/httpComposables";

// --- Interfaces para los datos de lecturas de Toys ---

/**
 * Interfaz para un registro de lectura individual de un juguete.
 */
export interface ToyReading {
  timestamp: string; // O Date
  value: number;
  metricType: string; 
  // Agrega aquí cualquier otra propiedad que venga en la lectura
}

/**
 * Interfaz para los parámetros de la consulta de lecturas de un juguete.
 */
export interface GetToyReadingsParams {
  macAddress: string;
  From?: string; // Formato date-time (ISO 8601)
  To?: string; // Formato date-time (ISO 8601)
  Metric?: string;
  MinValue?: number;
  MaxValue?: number;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  Desc?: boolean;
}

/**
 * Interfaz para el resumen de lecturas de un juguete.
 * Ajusta esta interfaz según la estructura real de la respuesta de tu API.
 */
export interface ToyReadingsSummary {
  macAddress: string;
  totalReadings: number;
  averageValue?: number;
  minValue?: number;
  maxValue?: number;
  // Agrega aquí cualquier otra propiedad que venga en el resumen
}

/**
 * Interfaz para los parámetros de la consulta de resumen de lecturas de un juguete.
 */
export interface GetToyReadingsSummaryParams {
  macAddress: string;
  From?: string; // Formato date (YYYY-MM-DD)
  To?: string; // Formato date (YYYY-MM-DD)
  Dummy?: boolean;
}

// --- Inyección de Endpoints para Toys ---

export const toysServerApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Endpoint para obtener lecturas de un juguete específico.
     * Utiliza BaseListResponse si la paginación es común en tus listas.
     */
    getToyReadings: builder.query<BaseListResponse<ToyReading>, GetToyReadingsParams>({
      query: ({ macAddress, ...params }) => {
        const queryParams = buildQueryParams(params);
        return `Toys/${macAddress}/readings?${queryParams}`;
      },
      providesTags: (_result, _error, { macAddress }) => [{ type: "Toy", id: macAddress }],
    }),

    /**
     * Endpoint para obtener un resumen de lecturas de un juguete específico.
     */
    getToyReadingsSummary: builder.query<ToyReadingsSummary, GetToyReadingsSummaryParams>({
      query: ({ macAddress, ...params }) => {
        const queryParams = buildQueryParams(params);
        return `Toys/${macAddress}/readings/summary?${queryParams}`;
      },
      providesTags: (_result, _error, { macAddress }) => [{ type: "Toy", id: macAddress }],
    }),
  }),
  overrideExisting: false, // Asegúrate de que esto sea 'false' para inyectar nuevos endpoints
});


export const {
  useGetToyReadingsQuery,
  useGetToyReadingsSummaryQuery,
} = toysServerApi;