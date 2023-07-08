import {SemesterSubmitionDateResponse} from "@/models/BACKEND-MODELS/SemesterSubmitionDateResponse";

export interface SemesterSubmitionDateOverviewResponse{
  Count :number;
  SemesterSubmitionDates : Array<SemesterSubmitionDateResponse>
}
