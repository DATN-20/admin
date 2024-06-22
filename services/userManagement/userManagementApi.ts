import { UserManagement } from "@/types/UserManagement"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const userManagementApi = createApi({
  reducerPath: "userManagementApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserManagement.GetUsersResponse, UserManagement.GetUsersRequest>({
      query: ({ limit, page }) => {
        const searchParams = new URLSearchParams()
        if (!limit) limit = 6
        if (!page) page = 1
        searchParams.append("limit", limit.toString())
        searchParams.append("page", page.toString())

        return {
          url: `api/v1/admin/management/users?${searchParams}`,
          method: "GET",
        }
      },
    }),
    lockUser: builder.mutation<UserManagement.LockUserResponse, UserManagement.LockUserRequest>({
      query: ({ lockedUserId, type, period, unit }) => {
        return {
          url: `api/v1/admin/management/users/lock`,
          method: "POST",
          body: { type, period, unit, lockedUserId },
        }
      },
    }),
    unlockUser: builder.mutation<string, UserManagement.UnlockUserRequest>({
      query: ({ lockedUserId }) => {
        return {
          url: `api/v1/admin/management/users/unlock`,
          method: "PATCH",
          responseHandler: "text",
          body: { lockedUserId },
        }
      },
    }),
    getNewUserAnalysis: builder.query<UserManagement.GetNewUserAnalysisResponse, UserManagement.GetNewUserAnalysisRequest>({
      query: ({ startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        if (!startDate) startDate = new Date()
        if (!endDate) endDate = new Date()
        searchParams.append("startDate", startDate.toISOString())
        searchParams.append("endDate", endDate.toISOString())

        return {
          url: `api/v1/admin/management/users/analysis/new-user?${searchParams}`,
          method: "GET",
        }
      },
    }),
    getAPIRequestAnalysis: builder.query<UserManagement.GetApiRequestTimesResponse, UserManagement.GetApiRequestTimesRequest>({
      query: ({ userId, endpoint, startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        if (!startDate) startDate = new Date()
        if (!endDate) endDate = new Date()
        if (!endpoint) endpoint = "/generate-image/image-to-image"
        searchParams.append("userId", userId.toString())
        searchParams.append("endpoint", endpoint)
        searchParams.append("startDate", startDate.toISOString())
        searchParams.append("endDate", endDate.toISOString())

        return {
          url: `api/v1/admin/management/users/api-request-times?${searchParams}`,
          method: "GET",
        }
      },
    }),
  }),
})

export const { 
  useGetUsersQuery, 
  useLockUserMutation, 
  useUnlockUserMutation, 
  useGetNewUserAnalysisQuery, 
  useGetAPIRequestAnalysisQuery
 } = userManagementApi