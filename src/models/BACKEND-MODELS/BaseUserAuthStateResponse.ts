import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";

export interface BaseUserAuthStateResponse {
  IsAuth: boolean;
  SessionIdentified: string;
  UserDataDetails: UserDataDetails;
}
