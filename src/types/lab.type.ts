import { LabSemesterEnum } from "@/enums/LabSemesterEnum"
import { Ref } from "vue";
import { Department } from './department.type';

export interface Lab{
    labId:number
    title:string,
    semester : LabSemesterEnum,
    description:string
    departments : Ref<Array<Department>>
  }
