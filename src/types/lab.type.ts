import { AttendanceEnum } from "@/enums/AttendanceEnums";
import { LabSemesterEnum } from "@/enums/LabSemesterEnum"
import { Ref } from "vue";
import { Department } from './department.type';

export interface Lab{
    labId:string,
    labTitle:string,
    semester:LabSemesterEnum | null,
    description?:string,
    departments : Ref<Array<Department>> | undefined
    attendance? : {
      value:string,
      attendaceValue : AttendanceEnum
    }
    //departments : Array<Department>
  }
