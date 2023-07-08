import { DaysOfWeekEnum } from "@/enums/DaysOfWeekEnum";
export interface DaysOfWeek{
  title:string,
  value:DaysOfWeekEnum
}
export const daysOfWeek : Array<DaysOfWeek> = [
  {
    title:'Δευτέρα',
    value:DaysOfWeekEnum.Δευτέρα
  },
  {
    title:'Τρίτη',
    value:DaysOfWeekEnum.Τρίτη
  },
  {
    title:'Τετάρτη',
    value:DaysOfWeekEnum.Τετάρτη
  },
  {
    title:'Πέμπτη',
    value:DaysOfWeekEnum.Πέμπτη
  },
  {
    title:'Παρασκευή',
    value:DaysOfWeekEnum.Παρασκευή
  },

  ];
