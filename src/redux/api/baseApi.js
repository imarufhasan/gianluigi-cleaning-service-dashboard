import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"


const baseQuery = fetchBaseQuery({
    // baseUrl: "http://172.252.13.3:8000/api",
    // baseUrl: "https://backend.brikky.net/api",
    baseUrl: "https://backend.brikkydash.net/api",
    // baseUrl: "https://brickk-backend.onrender.com/api",
    // baseUrl: "http://10.10.20.73:8000/api",
    // credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState()).auth.token;
      // console.log("token->",token);
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
       headers.set("Content-Type", "application/json");
      return headers;
    },
  }); 




export const baseApi = createApi({
    reducerPath:"baseApi",
    baseQuery:baseQuery,
    tagTypes:["user"],
    endpoints:()=>({})
})


