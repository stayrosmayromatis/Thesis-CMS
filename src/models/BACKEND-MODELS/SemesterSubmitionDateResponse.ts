import { ActivityStatus } from '@/enums/ActivityStatusEnum';
import { PeriodicityEnum } from '@/enums/PeriodicityEnum';
export interface SemesterSubmitionDateResponse {
    Id :string;
    Semester:string;
    Active : ActivityStatus;
    IsActive : boolean;
    Periodicity : PeriodicityEnum;
}