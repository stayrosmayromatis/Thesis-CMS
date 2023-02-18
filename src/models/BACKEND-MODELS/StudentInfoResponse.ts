import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";

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
}
