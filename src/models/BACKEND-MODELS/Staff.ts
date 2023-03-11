import { BaseUser } from "@/models/BACKEND-MODELS/BaseUser";

export interface Staff extends BaseUser {
  personalTitle: string;
  eduPersonalEntitlementEn: string;
  eduPersonalEntitlementEl: string;
}
