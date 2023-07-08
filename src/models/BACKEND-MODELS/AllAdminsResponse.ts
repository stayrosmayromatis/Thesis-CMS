import {BaseUserResponse} from "@/models/BACKEND-MODELS/BaseUserResponse";

export  interface  AllAdminsResponse{
   Admins : Array<BaseUserResponse>
    Count:number;
}
