import { UserDataDetails } from "@/models/BACKEND-MODELS/UserDataDetails";

export interface BaseUserAuthStateResponse {
  IsAuth: boolean;
  UserDataDetails: UserDataDetails;
}


