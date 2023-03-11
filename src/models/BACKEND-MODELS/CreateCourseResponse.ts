import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { AttendanceEnum } from "@/enums/AttendanceEnums"
import { DaysOfWeekEnum } from '@/enums/DaysOfWeekEnum';

export interface CreateCourseResponse {
    CourseName:string,         
    CourseCode:string       
    Semester :LabSemesterEnum
    ShortDescription:string
    CourseChip:Array<string>,        
    ProfCoordinatorSureName :string,
    ProfCoordinatorFirstName :string,
    LabInfos:Array<LabInfo> 
    CourseAttentance :AttendanceEnum
}

export interface LabInfo {
    LabRoomName:string,
    ProfessorSureName:string,
    ProfessorFirstName:string,
    From:TimeOnly,
    To:TimeOnly,
    Seats:number,
    HoursPerDay:number
    CourseDate:DaysOfWeekEnum
    CourseCode:string
}

export interface TimeOnly{
    Second:number,
    Minute:number,
    Hour:number,
    Millisecond:number,
    Ticks:number
}