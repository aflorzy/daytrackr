import { StatusType } from "../enums";

export interface AccessToken {
  accessToken: string;
  tokenType: string;
}

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
  id?: string;
  name: string;
  idx: number;
}

export interface Day {
  id?: string;
  date: Date;
  events: Event[];
}

export interface ResponseMessageDailyEvent {
  message: string;
  httpStatus: string;
  dailyEvent: Day;
  dailyEventList: Day[];
}
export interface ResponseMessage {
  message: string;
  statusType: StatusType;
}

export interface FeedbackMessage {
  subject: string;
  body: string;
  attachments: any[];
}
