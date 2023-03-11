import { DaysOfWeekEnum } from '@/enums/DaysOfWeekEnum';
import { BaseUser } from '@/models/BACKEND-MODELS/BaseUser';
export interface Department {
  Guid:string,
  deptId:string,
  fromTime:string,
  toTime:string,
  day:DaysOfWeekEnum,
  numberOfStudents: number,
  selectedTeacher? :BaseUser,
  errorOnDeptId?:boolean,
  errorOnSelectedTeacher?:boolean,
  errorOnFromTime?:boolean,
  errorOnToTime?:boolean
}
