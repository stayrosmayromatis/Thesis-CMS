import { DaysOfWeekEnum } from '@/enums/DaysOfWeekEnum';
import { AttendanceEnum } from "@/enums/AttendanceEnums"
import { LabSemesterEnum } from "@/enums/LabSemesterEnum"
import { TimeObject } from '@/components/UI/AddLab.vue';
import { Department } from '../department.type';

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