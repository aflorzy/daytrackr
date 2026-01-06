
export interface CalendarMonth {
  weeks: CalendarWeek[];
  name: string;
  monthOfYear: number;
  year: number;
}
export interface CalendarWeek {
  days: CalendarDay[];
  weekOfYear: number;
  weekOfMonth: number;
}
export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  dayOfWeek: number;
  dayOfWeekStr: string;
  weekOfMonth: number;
  weekOfYear: number;
  monthStrAbbv: string;
  monthStr: string;
  day: Day;
}

export interface Event {
  name: string;
  idx: number;
  id?: string;
  note?: string;
}

export interface Day {
  id?: string;
  date: Date;
  events: Event[];
}
