import {serverApi} from "../serverApi";
import BaseListResponse from "../../contracts/BaseListResponse";
import {Patient} from "../../contracts/patient/patientsDto";
import {buildQueryParams} from "../../composables/httpComposables";

export const patientServerApi =  serverApi.injectEndpoints({
    endpoints: builder => ({

        listPatients: builder.query<BaseListResponse<Patient>, { page?: number, pageSize?: number }>({
            query: ({ page = 1, pageSize = 10 }) => {
                const params = buildQueryParams({ page, pageSize });
                return `Patients?${params}`;
            },
            providesTags: ['Patient']
        })

    }),
    overrideExisting: false
})

export const {
    useListPatientsQuery
} = patientServerApi;