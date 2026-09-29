import { baseApi } from "../../api/baseApi";

// Path: src/redux/feature/banner/bannerApi.js  (tomar folder structure onujayi rakho)
const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /admin/banners
    getBanners: builder.query({
      query: () => ({
        url: "/admin/banners",
        method: "GET",
      }),
    }),

    // POST /admin/banners  (form-data: image, title)
    createBanner: builder.mutation({
      query: (formData) => ({
        url: "/admin/banners",
        method: "POST",
        body: formData, // FormData object, JSON.stringify kora jabe na
      }),
    }),

    // DELETE /admin/banners/:id
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/admin/banners/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;