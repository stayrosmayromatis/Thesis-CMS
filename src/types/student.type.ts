import { BaseUser } from "@/types/baseUser.type";

export interface Student extends BaseUser {
  am: string;
  userId: string;
  mail?: string;
  regsem: string;
  regyear: string;
  semester: string;
}
