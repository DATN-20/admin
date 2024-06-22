import { DateTotal } from "./DateTotal";

export namespace UserManagement {
    interface User {
        id: number;
        first_name: string;
        username: string;
        email: string;
        role: string;
        isLocked: boolean;
        createdAt: string;
    }

    interface LockedInformation {
        user_id: number;
        type: LockUserType;
        locked_at: Date;
        expired_at: Date;
    }
    
    interface UserData {
        user: User;
        locked_information: LockedInformation | null;
    }

    export interface GetUsersRequest {
        limit: number;
        page: number;
    }
  
    export interface GetUsersResponse {
        limit: number;
        page: number;
        total: number;
        data: UserData[];
    }
  
    export interface LockUserRequest {
      lockedUserId: number;
      type: LockUserType;
      period: number;
      unit: DateUnit;
    }
  
    export interface LockUserResponse {
      user_id: number;
      type: LockUserType;
      locked_at: Date;
      expired_at: Date;
    }
  
    export interface UnlockUserRequest {
      lockedUserId: number;
    }
    
    export interface GetNewUserAnalysisRequest {
        startDate: Date;
        endDate: Date;
    }
    
    export interface GetNewUserAnalysisResponse {
        start_date: Date;
        end_date: Date; 
        data: DateTotal[];
    }

    export interface GetApiRequestTimesRequest {
        userId: number;
        endpoint: string;
        startDate: Date;
        endDate: Date;
    }
  
    export interface GetApiRequestTimesResponse {
      endpoint?: string;
      start_date: Date;
      end_date: Date;
      data: DateTotal[];
    }
  }
  