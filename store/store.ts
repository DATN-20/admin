import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query/react"
import authReducer from "../features/authSlice"
import { userManagementApi } from "../services/userManagement/userManagementApi"
import {logMonitoringApi} from "../services/log-monitoring/logMonitoringApi"
import {imageStatisticsApi} from "../services/generation/imageStatisticsApi"
import { authApi } from "../services/auth/authApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userManagementApi.reducerPath]: userManagementApi.reducer,
    [logMonitoringApi.reducerPath]: logMonitoringApi.reducer,
    [imageStatisticsApi.reducerPath]: imageStatisticsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(
      { serializableCheck: false }
    ).concat(
        authApi.middleware,
        userManagementApi.middleware,
        logMonitoringApi.middleware,
        imageStatisticsApi.middleware
    ),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
setupListeners(store.dispatch)
