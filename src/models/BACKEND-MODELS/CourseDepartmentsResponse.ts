import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";
import { PersonAffiliation } from "@/enums/PersonAffiliationEnum";

export interface CourseDepartmentsResponse {
  CourseId :string;
  UserType:PersonAffiliation ;
  CourseCode: string;
  CourseName: string;
  Semester?: LabSemesterEnum;
  SemesterString: string;
  Attendance?: AttendanceEnum;
  AttendanceString: string;
  CourseDepartments: Array<CourseDepartment>;
  IsAssistant : boolean;
  Count: number;
}

export interface CourseDepartment {
  LabId :string;
  LabName: string;
  FromString: string;
  ToString: string;
  Duration: number;
  MaxSeats: number;
  AvailableSeats: number;
  OccupiedSeats: number;
  CompletenessPercent: number;
  CourseDayString: string;
}
