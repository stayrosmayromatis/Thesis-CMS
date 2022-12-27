import { LabSemesterEnum } from "@/enums/LabSemesterEnum"
import { Ref } from "vue";
import { Department } from './department.type';

export interface Lab{
    labId:string,
    title:string,
    semester:LabSemesterEnum,
    description:string,
    // departments : Ref<Array<Department>>
    departments : Array<Department>
  }
