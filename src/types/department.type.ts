import { DaysOfWeekEnum } from '../enums/DaysOfWeekEnum';
export interface Department {
  deptId:string,
  fromTime:string,
  toTime:string,
  day:DaysOfWeekEnum,
  numberOfStudents: number,
  errorOnDeptId?:boolean,
  errorOnFromTime?:boolean,
  errorOnToTime?:boolean
}
