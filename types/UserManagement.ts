import { LockUserType } from "@/constants/LockUserType";
import { DateTotal } from "./DateTotal";
import { DateUnit } from "@/constants/DateUnit";

export namespace UserManagement {
  export interface User {
        id: number;
        first_name: string;
        last_name: string;
        alias_name: string | null;
        username: string;
        email: string;
        role: string;
        isLocked: boolean;
        createdAt: string;
    }

    export interface LockedInformation {
        user_id: number;
        type: LockUserType;
        locked_at: Date;
        expired_at: Date;
    }
    
    export interface UserData {
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
  