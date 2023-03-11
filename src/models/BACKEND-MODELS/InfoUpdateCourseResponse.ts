import { AttendanceEnum } from "@/enums/AttendanceEnums"
import { LabSemesterEnum } from "@/enums/LabSemesterEnum"
import { Department } from '@/models/department.type';

export interface InfoUpdateCourseResponse
{
CourseCode :string,
CourseName :string,
Semester :LabSemesterEnum
SemesterString:string
CourseAttendance :AttendanceEnum
CourseAttendanceString :string
ShortDescription :string,
Labs :Array<Department>
}