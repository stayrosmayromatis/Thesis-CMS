import { DaysOfWeekEnum } from '@/enums/DaysOfWeekEnum';
import { AttendanceEnum } from "@/enums/AttendanceEnums"
import { LabSemesterEnum } from "@/enums/LabSemesterEnum"
import { TimeObject } from '@/components/UI/AddLab.vue';

export interface InfoUpdateCourseResponse
{
CourseCode :string,
CourseName :string,
Semester :LabSemesterEnum
CourseAttendance :AttendanceEnum
ShortDescription :string,
Labs :Array<InfoLabUpdateResponse>
}

export interface InfoLabUpdateResponse
{
DayOfWeek:DaysOfWeekEnum,
From:TimeObject,
To:TimeObject,
LabName:string ,
ProfId: string,
Seats:number,
}