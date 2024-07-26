export namespace LogMonitoring {
    export interface GetApiLoggingRequest {
        limit: number;
        page: number;
        startDate: Date;
        endDate: Date;
        endpoint: AcceptanceEndpoint;
      }

      export interface ApiLogJson {
        user_id: number;
        requested_at: Date;
        endpoint: string;
        severity: string;
        message: string;
        file: string;
      }

    export interface GetApiLoggingResponse {
        page: number;
        limit: number;
        total: number;
        data: ApiLogJson[];
      }

      export interface GetSystemLoggingRequest {
        limit: number;
        page: number;
        startDate: Date;
        endDate: Date;
      }

      export interface GetSystemLoggingResponse {
        page: number;
        limit: number;
        total: number;
        data: GetSystemLoggingRequest[];
      }
}