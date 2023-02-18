import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';

export interface StudentInfoResponse {
  SubmittedLabs: Array<SubmittedLab>;
  Count: number;
}

export interface SubmittedLab {
  LabName: string;
  CourseCode: string;
  CourseName: string;
  From: string;
  To: string;
  Day: DaysOfWeekEnum;
  DayString: string;
  CourseInfo: Array<string>;
  Attendance :AttendanceEnum,
  AttendanceString:string,
  Semester: LabSemesterEnum,
  SemesterString:string
}
