import { serverApi } from "../serverApi";
import BaseListResponse from "../../contracts/BaseListResponse";
import { Patient } from "../../contracts/patient/patientsDto";
import { buildQueryParams } from "../../composables/httpComposables";
import { PatientCreateDto } from "../../contracts/patient/patientCreateDto";
import { PatientUpdateDto } from "../../contracts/patient/patientUpdateDto";
import { AssignTherapistsDto } from "../../contracts/patient/assignTherapistsDto";
import { AssignTutorsDto } from "../../contracts/patient/assignTutorsDto";

interface ListPatientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  therapistId?: string;
  tutorId?: string;
}
export interface PatientSummaryResponse {
    registeredCount: number;
    unregisteredCount: number;
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

    getToyByPatientId: builder.query<any, string>({
      query: (id) => `Patients/${id}/toy`,
      providesTags: (_result, _error, id) => [{ type: "Patient", id }],
    }), 

    getPatientsSummary: builder.query<PatientSummaryResponse, { date: string; dummy: boolean }>({
      query: ({ date, dummy }) => ({
        url: `Patients/summary?Date=${date}&Dummy=${dummy}`,
        method: "GET",
      }),
    }),

    getMonthlyActivitySummary: builder.query<BaseListResponse<MonthlyActivity>, { month: number; dummy?: boolean }>({
      query: ({ month, dummy = false }) => `Patients/activity/summary?Month=${month}&Dummy=${dummy}`,
    }),

  }),
  overrideExisting: false,
});

export const {
  useListPatientsQuery,
  useGetPatientByIdQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useAssignTherapistsMutation,
  useAssignTutorsMutation,
  useGetToyByPatientIdQuery,
  useGetPatientsSummaryQuery,
  useGetMonthlyActivitySummaryQuery
} = patientServerApi;
