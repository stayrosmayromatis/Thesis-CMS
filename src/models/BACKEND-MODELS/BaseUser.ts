import { TypeStaff } from "@/enums/StaffTypeEnum";

export interface BaseUser {
  id: string;
  displayNameEn: string;
  displayNameEl: string;
  eduPersonAffiliation: TypeStaff;
  titleEn: string;
  titleEl: string;
  Guid? :string;
  dm?:string;
  admin?:boolean;
  am?:string;
  cnEn?:string;
  cnEl?:string;
}
