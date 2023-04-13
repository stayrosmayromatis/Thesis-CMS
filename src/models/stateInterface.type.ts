import { TypeStaff } from '@/enums/StaffTypeEnum';
import { UserDataDetails } from '@/models/BACKEND-MODELS/UserDataDetails';
import { BaseUser } from '@/models/BACKEND-MODELS/BaseUser';
export interface State{
    IsAuth:boolean;
    IsStudent:boolean;
    IsTeacher:boolean;
    IsStaffType?:TypeStaff ;
    UserDataDetails? : UserDataDetails;
    SeededProfessors? : Array<BaseUser>;
}
