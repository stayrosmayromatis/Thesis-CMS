import { TypeStaff } from "@/enums/StaffTypeEnum";

export interface UserDataDetails {
  FourDigitId: string;
  DisplayNameEn: string;
  DisplayNameEl: string;
  PersonAffiliation: string;
  EduPersonAffiliation: TypeStaff;
  EduPersonAffiliationString: string;
  TitleEn: string;
  TitleEl: string;
  Am: string;
  UserId: string;
  Mail: string;
  RegSem: string;
  RegYear: string;
  Semester: string;
  PersonalTitle: string;
  EduPersonalEntitlementEn: string;
  EduPersonalEntitlementEl: string;
}
