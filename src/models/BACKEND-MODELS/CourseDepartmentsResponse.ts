import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";

export interface CourseDepartmentsResponse {
  CourseId :string;
  CourseCode: string;
  CourseName: string;
  Semester?: LabSemesterEnum;
  SemesterString: string;
  Attendance?: AttendanceEnum;
  AttendanceString: string;
  CourseDepartments: Array<CourseDepartment>;
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
}
