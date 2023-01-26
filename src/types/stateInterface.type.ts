import { TypeStaff } from '@/enums/StaffTypeEnum';
export interface State{
    isAuth:boolean;
    isStudent:boolean;
    isTeacher:boolean;
    isStaffType?:TypeStaff;
}