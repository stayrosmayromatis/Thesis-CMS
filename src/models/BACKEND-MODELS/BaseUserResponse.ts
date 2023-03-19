import {TypeStaff} from "@/enums/StaffTypeEnum";

export interface BaseUserResponse {
  Id: string;
  EduPersonAffiliation: TypeStaff;
  DisplayNameEl: string;
  DisplayNameEn: string;
}
