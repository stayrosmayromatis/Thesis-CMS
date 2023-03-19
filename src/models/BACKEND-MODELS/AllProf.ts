import {BaseUserResponse} from "@/models/BACKEND-MODELS/BaseUserResponse";

export interface AllProf {
  Professors: Array<BaseUserResponse>;
  Count : number
}
