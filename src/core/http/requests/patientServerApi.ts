import { serverApi } from "../serverApi";
import BaseListResponse from "../../contracts/BaseListResponse";
import { Patient } from "../../contracts/patient/patientsDto";
import { buildQueryParams } from "../../composables/httpComposables";
import { PatientCreateDto } from "../../contracts/patient/patientCreateDto";
import { PatientUpdateDto } from "../../contracts/patient/patientUpdateDto";
import { AssignTherapistsDto } from "../../contracts/patient/assignTherapistsDto";
import { AssignTutorsDto } from "../../contracts/patient/assignTutorsDto";

// --- NUEVO DTO PARA EL RESUMEN DE ACTIVIDAD DEL PACIENTE ---
export interface PatientActivitySummary {
  date: string; // "YYYY-MM-DD" o "MonthYYYY"
  patientId: string;
  patientName: string;
  totalDays: number;
  happyDays: number;
  neutralDays: number;
  sadDays: number;
  dailySummaries: DailyPatientActivitySummary[];
}

export interface DailyPatientActivitySummary {
  date: string; // "YYYY-MM-DD"
  stressLevel: 'low' | 'medium' | 'high'; // Ejemplo, ajusta a tus niveles reales
  emotionDistribution: { // Puedes ajustar esto a la estructura real de tus emociones
    happy: number;
    neutral: number;
    sad: number;
    // ... otras emociones
  };
}
// --- FIN DEL NUEVO DTO ---


interface ListPatientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  therapistId?: string;
  tutorId?: string;
}

// Interfaz para los parámetros de la consulta de resumen de actividad del paciente
interface GetPatientActivitySummaryParams {
  month: number;
  dummy?: boolean;
}

// Interfaz para los parámetros de la consulta de resumen de pacientes por fecha
interface GetPatientSummaryParams {
  date?: string; // Formato "YYYY-MM-DD"
  dummy?: boolean;
}

export const patientServerApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({

    listPatients: builder.query<BaseListResponse<Patient>, ListPatientsParams>({
      query: ({ page = 1, pageSize = 10, search, therapistId, tutorId }) => {
        const params = buildQueryParams({ page, pageSize, search, therapistId, tutorId });
        return `Patients?${params}`;
      },
      providesTags: ["Patient"],
    }),

    getPatientById: builder.query<Patient, string>({
      query: (id) => `Patients/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Patient", id }],
    }),

    createPatient: builder.mutation<Patient, PatientCreateDto>({
      query: (body) => ({
        url: "Patients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Patient"],
    }),

    updatePatient: builder.mutation<void, PatientUpdateDto>({
      query: ({ id, ...body }) => ({
        url: `Patients/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Patient", id: arg.id }],
    }),

    deletePatient: builder.mutation<void, string>({ // <--- NUEVO ENDPOINT DE ELIMINACIÓN
      query: (id) => ({
        url: `Patients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Patient'], // Importante para que la lista de pacientes se refetchee
    }),

    assignTherapists: builder.mutation<void, { id: string; data: AssignTherapistsDto }>({
      query: ({ id, data }) => ({
        url: `Patients/${id}/therapists`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Patient", id: arg.id }],
    }),

    assignTutors: builder.mutation<void, { id: string; data: AssignTutorsDto }>({
      query: ({ id, data }) => ({
        url: `Patients/${id}/tutors`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Patient", id: arg.id }],
    }),

    getToyByPatientId: builder.query<any, string>({ // Asume que esto devuelve el objeto completo del juguete
      query: (id) => `Patients/${id}/toy`,
      providesTags: (_result, _error, id) => [{ type: "Patient", id }],
    }),

    getPatientActivitySummary: builder.query<PatientActivitySummary, GetPatientActivitySummaryParams>({
      query: ({ month, dummy }) => {
        const params = buildQueryParams({ Month: month, Dummy: dummy });
        return `Patients/activity/summary?${params}`;
      },
      providesTags: ["Patient"], // Considera una etiqueta más específica si tienes muchos resúmenes, ej: "PatientActivitySummary"
    }),

    getPatientSummary: builder.query<any, GetPatientSummaryParams>({ // Asume el tipo de respuesta, ajusta si es necesario
      query: ({ date, dummy }) => {
        const params = buildQueryParams({ Date: date, Dummy: dummy });
        return `Patients/summary?${params}`;
      },
      providesTags: ["Patient"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useListPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation, // Exporta el hook de eliminación
  useAssignTherapistsMutation,
  useAssignTutorsMutation,
  useGetToyByPatientIdQuery,
  useGetPatientActivitySummaryQuery,
  useGetPatientSummaryQuery, // Exporta el hook para el resumen general de pacientes
} = patientServerApi;