import { AttendanceEnum } from "@/enums/AttendanceEnums"
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum"
import { LabSemesterEnum } from "@/enums/LabSemesterEnum"

export interface UpdateCourseRequest{
  CourseId:string,
  CourseName:string,
  CourseCode:string,
  Semester :LabSemesterEnum
  ShortDescription:string,
  CourseAttentance:AttendanceEnum
  Labs:Array<UpdateLaboratories>
}

export interface UpdateLaboratories{
  LabId:string
  LabName:string
  ProfId:string
  From:string
  To:string
  Seats:number
  DaysOfWeek:DaysOfWeekEnum
}
