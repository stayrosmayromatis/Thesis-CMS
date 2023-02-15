import { AttendanceEnum } from "@/enums/AttendanceEnums"
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum"
import { LabSemesterEnum } from "@/enums/LabSemesterEnum"

export interface CreateCourseRequest {
    CourseName:string
    CourseCode:string  
    Semester:LabSemesterEnum
    AvailableSemester:number,
    ShortDescription:string,
    CourseAttentance:AttendanceEnum
    Labs:Array<LaboratoryRequest>
}

export interface LaboratoryRequest {
    LabName:string,
    ProfId:string,
    DaysOfWeekEnums:DaysOfWeekEnum,
    From:string,
    To:string,
    Seats:number
}