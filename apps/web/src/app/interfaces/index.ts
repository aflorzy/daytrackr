import { StatusType } from "../enums";

export interface AccessToken {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface ResponseMessage {
  message: string;
  statusType: StatusType;
}

export interface FeedbackMessage {
  subject: string;
  body: string;
  attachments: File[];
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
