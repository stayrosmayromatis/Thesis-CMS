import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { PersonAffiliation } from "@/enums/PersonAffiliationEnum";
export interface PersonalisedCoursesBySemesterResponse {
  PersonalisedCourses: Array<PersonalisedCourseBySemester>;
  UserType?:PersonAffiliation;
  Count: number;
}
export interface PersonalisedCourseBySemester {
  CourseGUID: string;
  CourseName: string;
  CourseCode: string;
  Semester: LabSemesterEnum;
  SemesterString: string;
  ShortDescription: string;
  CourseChip: Array<string>;
  CourseAttendance: AttendanceEnum;
  CourseAttendanceString: string;
  CanSubmit?: boolean;
  HasAlreadySubmitted?: boolean;
  IsAssistant?:boolean;
  CanSubmitAfter?:Date
  CanSubmitAfterString?:string
  LabInfo?: SubmittedLabInfo;
}
export interface SubmittedLabInfo {
  LabName: string;
  Daystring: string;
  FromTimeString: string;
  ToTimeString: string;
}
