import { baseApi } from "../../api/baseApi";

const othersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: (year) => ({
        url: "/admin/statistics",
        method: "GET",
        params: { year },
      }),
    }),
    recentJoinUsers: builder.query({
      query: () => ({
        url: "/admin/recent-users",
        method: "GET",
      }),
    }),
    allCategory: builder.query({
      query: ({ limit, page }) => ({
        url: "/admin/categories",
        method: "GET",
        params: { page, limit },
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
     
      }),
    
    }),
    editCategory: builder.mutation({
      query: ({id, data}) => ({
           url: `/admin/categories/${id}`,
        method: "PUT",
        body: data
      }),
    
    }),
    paymentTracking: builder.query({
      query: ({ limit, page }) => ({
        url: "/transactions/payment-tracking",
        method: "GET",
        params: { page, limit },
      }),
    }),
    getSuspentions: builder.query({
      query: ({ limit, page }) => ({
        url: "/admin/account-suspension",
        method: "GET",
        params: { page, limit },
      }),
    }),
    getRefferal: builder.query({
      query: ({ limit, page }) => ({
        url: "/admin/referral-program",
        method: "GET",
        params: { page, limit },
      }),
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "/admin/categories",
        method: "POST",
        body: formData,
      }),
    }),
    suspenseStatusChange: builder.mutation({
      query: ({data,id}) => ({
        url:`/admin/users/status/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    createAndUpdateAbout: builder.mutation({
      query: (data) => ({
        url:`/admin/content/about-us`,
        method: "PUT",
        body: data,
      }),
    }),
    createAndUpdateTerms: builder.mutation({
      query: (data) => ({
        url:`/admin/content/terms-and-conditions`,
        method: "PUT",
        body: data,
      }),
    }),
    createAndUpdateAffiliate: builder.mutation({
      query: (data) => ({
        url:`/admin/content/affiliation-program`,
        method: "PUT",
        body: data,
      }),
    }),
    createAndUpdatePrivacy: builder.mutation({
      query: (data) => ({
        url:`/admin/content/privacy-policy`,
        method: "PUT",
        body: data,
      }),
    }),
    getTerms: builder.query({
      query: () => ({
        url:`/admin/content/terms-and-conditions`,
        method: "GET",
        // body: data,
      }),
    }),
    getAffiliate: builder.query({
      query: () => ({
        url:`/admin/content/affiliation-program`,
        method: "GET",
        // body: data,
      }),
    }),
    getPrivacy: builder.query({
      query: () => ({
        url:`/admin/content/privacy-policy`,
        method: "GET",
        // body: data,
      }),
    }),
    getAbout: builder.query({
      query: () => ({
        url:`/admin/content/about-us`,
        method: "GET",
        // body: data,
      }),
    }),
  }),
});

export const {
  useGetStatsQuery,
  useRecentJoinUsersQuery,
  useAllCategoryQuery,
  useCreateCategoryMutation,
  usePaymentTrackingQuery,
  useGetSuspentionsQuery,
  useSuspenseStatusChangeMutation,
  useGetRefferalQuery,
  useCreateAndUpdateAboutMutation,
  useCreateAndUpdatePrivacyMutation,useCreateAndUpdateTermsMutation,useGetPrivacyQuery,useGetAboutQuery,useGetTermsQuery,useCreateAndUpdateAffiliateMutation,useGetAffiliateQuery,useDeleteCategoryMutation,useEditCategoryMutation
} = othersApi;
