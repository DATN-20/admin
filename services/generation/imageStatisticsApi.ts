import { ImageFilterType } from "@/constants/ImageFilterType"
import { ImageStatistics } from "@/types/ImageStatistics"
import { LogMonitoring } from "@/types/LogMonitoring"
import { UserManagement } from "@/types/UserManagement"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { get } from "http"

export const imageStatisticsApi = createApi({
  reducerPath: "imageStatisticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getImageStatistics: builder.query<ImageStatistics.ImageStatisticsResponse, ImageStatistics.ImageStatisticsRequest>({
        query: ({ startDate, endDate, style, aiName, imageType }) => {
            const searchParams = new URLSearchParams()
            if (!startDate) startDate = new Date()
            if (!endDate) endDate = new Date()
            if (!style) style = "ALL"
            if (!aiName) aiName = "ALL"
            if (!imageType) imageType = ImageFilterType.ALL
            searchParams.append("startDate", startDate.toISOString())
            searchParams.append("endDate", endDate.toISOString())
            searchParams.append("style", style)
            searchParams.append("aiName", aiName)
            searchParams.append("imageType", imageType)
    
            return {
            url: `api/v1/admin/statistic/images/generated?${searchParams}`,
            method: "GET",
            }
        },
        }),
  }),
})

export const { 
    useGetImageStatisticsQuery
    } = imageStatisticsApi