import { DaysOfWeekEnum } from '../enums/DaysOfWeekEnum';
import { BaseUser } from '@/models/BACKEND-MODELS/BaseUser';
export interface Department {
  deptId:string,
  fromTime:string,
  toTime:string,
  day:DaysOfWeekEnum,
  numberOfStudents: number,
  selectedTeacher? :BaseUser,
  errorOnDeptId?:boolean,
  errorOnFromTime?:boolean,
  errorOnToTime?:boolean
}
