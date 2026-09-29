import { baseApi } from "../../api/baseApi";

const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOwners: builder.query({
      query: ({page,limit}) => ({
        url: "/admin/owners",
        method: "GET",
        params: { page,limit },
      }),
    }),
    getAllOwnersProfile: builder.query({
      query: ({page,limit}) => ({
        url: "/admin/owners/profile-status",
        method: "GET",
        params: { page,limit },
      }),
    }),
    getAllProvidersProfile: builder.query({
      query: ({page,limit}) => ({
        url: "/admin/providers/profile-status",
        method: "GET",
        params: { page,limit },
      }),
    }),
    getAllProviders: builder.query({
      query: ({page,limit}) => ({
        url: "/admin/providers",
        method: "GET",
        params: { page,limit },
      }),
    }),
    getAllBooking: builder.query({
      query: ({page,limit}) => ({
        url: "/admin/bookings",
        method: "GET",
        params: { page,limit },
      }),
    }),
    getAllTransections: builder.query({
      query: ({page,limit}) => ({
        url: "/transactions/booking-payments",
        method: "GET",
        params: { page,limit },
      }),
    }),
    searchUsers: builder.query({
      query: (searchTerm) => ({
        url: "/admin/search",
        method: "GET",
        params: { searchTerm },
      }),
    }),
    singleUsers: builder.query({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: "GET",
      }),
    }),
    myData: builder.query({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
      }),
    }),
    blockUsers: builder.mutation({
      query: ({data,id}) => ({
        url: `/admin/users/status/${id}`,
        method: "PATCH",
        body:data
      }),
    }),
    editProfile: builder.mutation({
      query: ({data}) => ({
        url: `/admin/edit-profile`,
        method: "PUT",
        body:data
      }),
    }),
    changePass: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "PUT",
        body:data
      }),
    }),
  }),
});

export const {
  useGetAllOwnersQuery,
  useGetAllProvidersQuery,
  useSingleUsersQuery,
  useSearchUsersQuery,
  useBlockUsersMutation,
  useGetAllBookingQuery,
  useGetAllTransectionsQuery,
  useGetAllOwnersProfileQuery,
  useGetAllProvidersProfileQuery,useEditProfileMutation,useChangePassMutation,useMyDataQuery
} = userManagementApi;
