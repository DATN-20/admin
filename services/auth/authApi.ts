import { LoginResponse } from "@/types/LoginResponse";
import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../customBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, 
    {
      email: string;
      password: string;
    }>({
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
