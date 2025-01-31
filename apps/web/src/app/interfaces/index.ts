import { StatusType } from "../enums";

export interface AccessToken {
  accessToken: string;
  refreshToken: string;
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

export interface ResponseMessage {
  message: string;
  statusType: StatusType;
}

export interface FeedbackMessage {
  subject: string;
  body: string;
  attachments: any[];
}

export interface ProfileDTO {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
}

export class Profile {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;

  constructor(profileDto: ProfileDTO) {
    this.firstName = profileDto.firstName;
    this.lastName = profileDto.lastName;
    this.preferredName = profileDto.preferredName;
    this.email = profileDto.email;
    this.phone = profileDto.phone;
  }

  public getFirstName(): string {
    return this.preferredName ?? this.firstName;
  }

  public getName(): string {
    return this.getFirstName();
  }

  public getFullName(): string {
    return `${this.getName()} ${this.lastName}`;
  }

  public getProperName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
