import { UserDataDetails } from "@/types/userDataDetails.type";

export interface BaseUserAuthStateResponse {
  IsAuth: boolean;
  SessionIdentified: string;
  UserDataDetails: UserDataDetails;
}
