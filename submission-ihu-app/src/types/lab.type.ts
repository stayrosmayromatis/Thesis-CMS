import { LabSemesterEnum } from "@/enums/LabSemesterEnum"

export interface Lab{
    labId:number
    title:string,
    semester : LabSemesterEnum,
    description:string
  }