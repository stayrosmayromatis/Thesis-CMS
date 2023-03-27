export interface GeneratedPrioritiesResponse {
  From: DateTimeResponse;
  To: DateTimeResponse;
  HighestPriorityDate: DateTimeResponse;
  ModeratePriorityDate: DateTimeResponse;
  LowestPriorityDate: DateTimeResponse;
}

export interface DateTimeResponse {
  DayOfWeek: string;
  Month: string;
  Year: string;
  Day: string;
  Formatted:string;
}
