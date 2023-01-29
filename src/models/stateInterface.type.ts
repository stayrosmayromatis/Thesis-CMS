import { TypeStaff } from '@/enums/StaffTypeEnum';
import { UserDataDetails } from '@/models/BACKEND-MODELS/UserDataDetails';
export interface State{
    IsAuth:boolean;
    IsStudent:boolean;
    IsTeacher:boolean;
    IsStaffType:TypeStaff | null;
    UserDataDetails : UserDataDetails | null
}
