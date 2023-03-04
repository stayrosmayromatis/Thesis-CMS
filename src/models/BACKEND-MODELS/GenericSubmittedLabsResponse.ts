import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";
import { LabSemesterEnum } from '@/enums/LabSemesterEnum';
import { PersonAffiliation } from "@/enums/PersonAffiliationEnum";

export interface GenericSubmittedLabsResponse {
  SubmittedLabs: Array<SubmittedLab>;
  Count: number;
  UserType?:PersonAffiliation
}

export interface SubmittedLab {
  CourseGUID : string;
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
  SemesterString:string,
  IsAssistantProfessor?:boolean
}
