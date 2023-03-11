import { TypeStaff } from "@/enums/StaffTypeEnum";
export interface InfoAggregateObjectResponse {
  FoundRegistration: boolean;
  PersonAffiliation: TypeStaff;
  LabName: string;
  CourseCode: string;
  CourseName: string;
  CountOfStudentsSubmited: number;
}
