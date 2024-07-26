import { LogMonitoring } from "@/types/LogMonitoring"
import { UserManagement } from "@/types/UserManagement"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { get } from "http"
import customBaseQuery from "../customBaseQuery"

export const logMonitoringApi = createApi({
  reducerPath: "logMonitoringApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getLoggingApi: builder.query<LogMonitoring.GetApiLoggingResponse, LogMonitoring.GetApiLoggingRequest>({
      query: ({ limit, page, startDate, endDate, endpoint }) => {
        const searchParams = new URLSearchParams()
        if (!limit) limit = 6
        if (!page) page = 1
        if (!startDate) startDate = new Date()
        if (!endDate) endDate = new Date()
        if (!endpoint) endpoint = AcceptanceEndpoint.TEXT_TO_IMAGE
        searchParams.append("limit", limit.toString())
        searchParams.append("page", page.toString())
        searchParams.append("startDate", startDate.toISOString())
        searchParams.append("endDate", endDate.toISOString())
        searchParams.append("endpoint", endpoint)

        return {
          url: `api/v1/admin/management/logging/api?${searchParams}`,
          method: "GET",
        }
      },
    }),
    getLoggingSystem: builder.query<LogMonitoring.GetSystemLoggingResponse, LogMonitoring.GetSystemLoggingRequest>({
      query: ({ limit, page, startDate, endDate }) => {
        const searchParams = new URLSearchParams()
        if (!limit) limit = 6
        if (!page) page = 1
        if (!startDate) startDate = new Date()
        if (!endDate) endDate = new Date()
        searchParams.append("limit", limit.toString())
        searchParams.append("page", page.toString())
        searchParams.append("startDate", startDate.toISOString())
        searchParams.append("endDate", endDate.toISOString())

        return {
          url: `api/v1/admin/management/logging/system?${searchParams}`,
          method: "GET",
        }
      },
    }),
  }),
})

export const { 
  useGetLoggingApiQuery, 
  useGetLoggingSystemQuery 
} = logMonitoringApi