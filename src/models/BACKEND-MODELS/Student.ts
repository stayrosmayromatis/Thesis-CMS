import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";

export interface Student extends BaseUser {
  am: string;
  userId: string;
  mail?: string;
  regsem: string;
  regyear: string;
  semester: string;
}
