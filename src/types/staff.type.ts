import { BaseUser } from "@/types/baseUser.type";

export interface Staff extends BaseUser {
  personalTitle: string;
  eduPersonalEntitlementEn: string;
  eduPersonalEntitlementEl: string;
}
