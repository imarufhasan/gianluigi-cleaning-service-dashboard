import { baseApi } from "../../api/baseApi";

const knowledgeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllKnowledge: builder.query({
      query: () => ({
        url: "/admin/knowledge-hub",
        method: "GET",
        // params: { page,limit },
      }),
    }),

    singleKnowledge: builder.query({
      query: (id) => ({
        url: `/admin/knowledge-hub/${id}`,
        method: "GET",
      }),
    }),
    createKnowledge: builder.mutation({
      query: (data) => ({
        url: `/admin/knowledge-hub`,
        method: "POST",
        body:data
      }),
    }),
    editKnowledge: builder.mutation({
      query: ({data,id}) => ({
        url: `/admin/knowledge-hub/${id}`,
        method: "PUT",
        body:data
      }),
    }),
    deleteKnowledge: builder.mutation({
      query: (id) => ({
        url: `/admin/knowledge-hub/${id}`,
        method: "DELETE",
     
      }),
    }),
  }),
});

export const {
useCreateKnowledgeMutation,useGetAllKnowledgeQuery,useSingleKnowledgeQuery,useEditKnowledgeMutation,useDeleteKnowledgeMutation
} = knowledgeApi;
