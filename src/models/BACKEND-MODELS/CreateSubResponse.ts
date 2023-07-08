import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum";

export interface CreateSubResponse {
    BaserUserId: string;
    CourseCode: string;
    CourseName: string;
    LabName: string;
    FromString: string;
    ToString: string;
    CourseDay: DaysOfWeekEnum
    CourseDayString: string;
    Semester: LabSemesterEnum
    SemesterString: string;
}