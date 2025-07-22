import { serverApi } from "../serverApi";
import { buildQueryParams } from "../../composables/httpComposables";
import BaseListResponse from "../../contracts/BaseListResponse";

// --- DTOs y tipos para juguetes ---

export interface ToyDto {
  id: string;
  name: string;
  macAddress: string;
  patientId: string;
}

export interface ToyCreateDto {
  name: string;
  macAddress: string;
  patientId: string;
}

export interface ToyUpdateDto {
  name: string;
  macAddress: string;
}

export interface ToyReading {
  timestamp: string;
  value: number;
  metricType: string;
}

export interface GetToyReadingsParams {
  macAddress: string;
  From?: string;
  To?: string;
  Metric?: string;
  MinValue?: number;
  MaxValue?: number;
  Page?: number;
  PageSize?: number;
  SortBy?: string;
  Desc?: boolean;
}

export interface ToyReadingsSummary {
  items: {
    date: string;       // "YYYY-MM-DD"
    status: string;     // "estable" | "crisis" | "ansioso"
  }[];
  summary: {
    ansioso: number;
    crisis: number;
    estable: number;
  };
  totalItems: number;
}



// export interface ToyReadingsSummary {
//   macAddress: string;
//   totalReadings: number;
//   averageValue?: number;
//   minValue?: number;
//   maxValue?: number;
//   dailyReadings?: DailyToyReading[];
// }

export interface DailyToyReading {
  date: string;
  value: number;
  emotions: string[];
}

export interface GetToyReadingsSummaryParams {
  macAddress: string;
  From?: string;
  To?: string;
  Dummy?: boolean;
}

// --- Inyección de endpoints en una sola API centralizada ---
export const toysServerApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    // Crear juguete
    createToy: builder.mutation<ToyDto, ToyCreateDto>({
      query: (body) => ({
        url: "Toys",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Toy"],
    }),

    // Listar juguetes
    listToys: builder.query<BaseListResponse<ToyDto>, { page?: number; pageSize?: number }>({
      query: ({ page = 1, pageSize = 100 }) => {
        const params = buildQueryParams({ page, pageSize });
        return `Toys?${params}`;
      },
      providesTags: ["Toy"],
    }),

    // Eliminar juguete
    deleteToy: builder.mutation<void, string>({
      query: (id) => ({
        url: `Toys/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Toy"],
    }),

    // Actualizar juguete
    updateToy: builder.mutation<ToyDto, { id: string; name: string; macAddress: string }>({
      query: ({ id, name, macAddress }) => ({
        url: `Toys/${id}`,
        method: "PUT",
        body: { name, macAddress },
      }),
      invalidatesTags: ["Toy"],
    }),

    // Obtener lecturas de un juguete
    getToyReadings: builder.query<BaseListResponse<ToyReading>, GetToyReadingsParams>({
      query: ({ macAddress, ...params }) => {
        const queryParams = buildQueryParams(params);
        return `Toys/${macAddress}/readings?${queryParams}`;
      },
      providesTags: (_result, _error, { macAddress }) => [{ type: "Toy", id: macAddress }],
    }),

    // Obtener resumen de lecturas de un juguete
    getToyReadingsSummary: builder.query<ToyReadingsSummary, GetToyReadingsSummaryParams>({
      query: ({ macAddress, ...params }) => {
        const queryParams = buildQueryParams(params);
        return `Toys/${macAddress}/readings/summary?${queryParams}`;
      },
      providesTags: (_result, _error, { macAddress }) => [{ type: "Toy", id: macAddress }],
    }),
  }),
  overrideExisting: false, // No sobrescribas si ya hay definidos
});

// --- Exportación de hooks ---
export const {
  useCreateToyMutation,
  useListToysQuery,
  useDeleteToyMutation,
  useUpdateToyMutation,
  useGetToyReadingsQuery,
  useGetToyReadingsSummaryQuery,
} = toysServerApi;
