import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body: { email: string; password: string }) => {
        return {
          url: "api/v1/auth/signin",
          method: "post",
          body,
        };
      },
    }),    
    logoutUser: builder.mutation({
      query: (user: {
          id: number
      }) => {
        return {
          url: "api/v1/auth/signout",
          method: "post",
          responseHandler: "text",
          params:user
        };
      },
    }),
  }),
  
});

export const { useLoginUserMutation, useLogoutUserMutation} = authApi;
