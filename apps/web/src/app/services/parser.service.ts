import { Injectable } from "@angular/core";
import { days_of_week } from "src/app/constants";
import { Event, Day } from "../interfaces";

@Injectable({
  providedIn: "root"
})
export class ParserService {
  parseDayText(dayText: string, initialDate: Date): Day[] {
    const dayStrLineList: string[] = this.convertDayTextToDayStrLineList(dayText);

    // Ensure prefixes are sequential (Sunday, Monday...)
    const validDayText: boolean = this.validateDayText(dayStrLineList);

    if (!validDayText) throw new Error("Days out of order!");

    // Remove day prefixes
    const dayStrList: string[] = this.removeDayStrPrefixes(dayStrLineList);

    const dayList: Day[] = [];
    dayStrList.forEach((dayStr: string) => {
      const eventList: Event[] = this.parseEventStringListToEventList(dayStr);

      const date = new Date(initialDate);
      date.setDate(initialDate.getDate() + dayList.length);

      dayList.push({
        date,
        events: eventList
      });
    });

    return dayList;
  }

  private convertDayTextToDayStrLineList(dayText: string): string[] {
    let dayStrList = dayText.split("\n");

    // Remove empty lines
    dayStrList = dayStrList.filter((dayStr: string) => !!dayStr.trim());

    return dayStrList;
  }

  private validateDayText(dayStrList: string[]): boolean {
    const PREFIX_DELIMETER = "- ";
    console.log("Validating text", dayStrList);
    const validFormat: boolean = dayStrList.every((dayStr: string) => dayStr.split(PREFIX_DELIMETER).length === 2);

    console.log("Valid format?", validFormat);
    if (!validFormat) return false;

    const firstDayOfWeek: string = dayStrList[0].split(PREFIX_DELIMETER)[0].toLowerCase().trim();
    const firstDayOfWeekIdx: number = days_of_week.indexOf(firstDayOfWeek);

    console.log("First day of week", firstDayOfWeek, firstDayOfWeekIdx);
    let tempIdx: number = firstDayOfWeekIdx;
    for (let i = 1; i < dayStrList.length; i++) {
      const nextIdx: number = tempIdx + 1 >= days_of_week.length ? 0 : tempIdx + 1;
      const prefix: string = dayStrList[i].split(PREFIX_DELIMETER)[0].toLowerCase().trim();
      const prefixIdx: number = days_of_week.indexOf(prefix);

      if (prefixIdx !== nextIdx) {
        return false;
      }
      tempIdx = prefixIdx;
    }

    // Early return if any condition is false
    return true;
  }

  private removeDayStrPrefixes(dayStrLineList: string[]) {
    const PREFIX_DELIMETER = "- ";

    return dayStrLineList.map((dayStrLine: string) => dayStrLine.split(PREFIX_DELIMETER)[1]);
  }

  parseEventStringListToEventList(eventStr: string): Event[] {
    const eventStrList: string[] = this.extractEvents(eventStr);

    const eventList: Event[] = eventStrList.map((eventStrTemp: string, index: number) => ({
      name: eventStrTemp,
      idx: index
    }));

    return eventList;
  }

  private extractEvents(dayStr: string): string[] {
    const events: string[] = dayStr.trim().split(",");

    // Check each event for special parenthesis cases ().
    // Event could only have left ;( or right :) parens
    // Else events could have both left and right (assume this case, but handle missing one)

    // If event has left paren, check next to see if contains right paren. Combine if so, else look for next left paren
    const eventList: string[] = [];
    for (let i = 0; i < events.length; i++) {
      const currentEvent: string = events[i].trim();
      const leftParenIdx: number = currentEvent.indexOf("(");
      const rightParenIdx: number = currentEvent.indexOf(")");

      // Preserve event if last event in list, doesn't contain a left paren, or contains both left and right parens
      if (i === events.length - 1 || leftParenIdx === -1 || rightParenIdx !== -1) {
        eventList.push(currentEvent);
        continue;
      }

      // Left paren found, search remainder of list to find right paren
      const parenEventsToAdd: string[] = [currentEvent];
      for (let j = i + 1; j < events.length; j++) {
        const tempEvent: string = events[j].trim();

        const rightParenIdx: number = tempEvent.indexOf(")");
        if (rightParenIdx === -1) {
          if (j === events.length - 1) {
            // Did not find right paren, this is the left only case
            break; // Explicit break despite being the last in loop
          } else {
            parenEventsToAdd.push(tempEvent);
          }
        } else {
          // right paren found
          parenEventsToAdd.push(tempEvent);
          break; // Early break because end of paren block
        }
      }

      if (parenEventsToAdd.length) {
        eventList.push(parenEventsToAdd.join(", "));
        i += parenEventsToAdd.length - 1;
      }
    }

    return eventList;
  }
}
