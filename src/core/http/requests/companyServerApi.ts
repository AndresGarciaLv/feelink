import { serverApi } from "../serverApi";

export interface CompanyResponse {
  id: string;
  name: string;
  rfc: string;
  personContact: string;
  phoneNumber: string;
  address: string;
}

export interface CompaniesApiResponse {
  items: CompanyResponse[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const companyServerApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<CompaniesApiResponse, void>({
      query: () => 'Companies',
      providesTags: ["Company"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCompaniesQuery,
} = companyServerApi;