import { serverApi } from "../serverApi";

export interface UserProfileResponse {
  id: string;
  name: string;
  picture: string | null;
  email: string;
  roleName: string;
  companyName: string;
}

export const userServerApi = serverApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserProfileResponse, void>({
      query: () => 'Users/me',
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentUserQuery,
} = userServerApi;