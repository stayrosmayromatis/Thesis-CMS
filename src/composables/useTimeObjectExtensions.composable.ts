import { TimeObject } from "@/models/BACKEND-MODELS/TimeObject";

export function useTimeObjectExtensions()
{
    function toTimeString(timeObject: TimeObject): string {
        let result: string = "";
        if (timeObject.hours < 10) {
          result = `0${timeObject.hours}:`;
        }
        else {
          result = `${timeObject.hours}:`;
        }
        if (timeObject.minutes < 10) {
          result += `0${timeObject.minutes}:`
        }
        else {
          result += `${timeObject.minutes}:`
        }
        if (timeObject.seconds < 10) {
          result += `0${timeObject.seconds}`
        }
        else {
          result += `${timeObject.seconds}`
        }
        return result;
    }
    function scrollToTop(){
      window.scrollTo({
        top:0,
        left:0,
        behavior:"smooth"
      });
    }
    return {toTimeString,scrollToTop}

}
