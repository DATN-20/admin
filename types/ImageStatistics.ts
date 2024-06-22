import { ImageFilterType } from "@/constants/ImageFilterType";
import { DateTotal } from "./DateTotal";

export namespace ImageStatistics {
    export interface ImageStatisticsRequest {
        style: string;
        aiName: string;
        imageType: ImageFilterType;
        startDate: Date;
        endDate: Date;
    }

    export interface ImageStatisticsResponse {
        endpoint?: string;
        start_date: Date;
        end_date: Date;
        data: DateTotal[];
    }
}