import { TestBed } from "@angular/core/testing";

import { Day, Event } from "@fzt/calendar";
import { ParserService } from "./parser.service";

describe("ParserService", () => {
  let service: ParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParserService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  /* it("should check if day prefix is correct", () => {
    const validDays: string[] = [
      "Saturday- work, meetings, lunch",
      "saturday- work, meetings, lunch",
      "saturday - work, meetings, lunch"
    ];

    validDays.forEach((day: string) => {
      expect(service.validateDayStrPrefix(day)).toBeTruthy();
    });
  });

  it("should check if day prefix is incorrect", () => {
    const invalidDays: string[] = [
      "",
      "Saturday work, meetings, lunch",
      "Saturdaywork, meetings, lunch",
      "Saturday, work, meetings, lunch"
    ];

    invalidDays.forEach((day: string) => {
      expect(service.validateDayStrPrefix(day)).toBeFalsy();
    });
  }); */

  it("should create event list from day string", () => {
    const eventStrList = "Breakfast, work, meetings, lunch";
    const eventList: Event[] = [
      {
        name: "Breakfast",
        idx: 0
      },
      {
        name: "work",
        idx: 1
      },
      {
        name: "meetings",
        idx: 2
      },
      {
        name: "lunch",
        idx: 3
      }
    ];

    expect(service.parseEventStringListToEventList(eventStrList)).toEqual(eventList);
  });

  it("should create event list from day string when event has parenthesis and no inner events", () => {
    const eventStrList = "Breakfast, work, fish (2x 1lb, dink), lunch";
    const eventList: Event[] = [
      {
        name: "Breakfast",
        idx: 0
      },
      {
        name: "work",
        idx: 1
      },
      {
        name: "fish (2x 1lb, dink)",
        idx: 2
      },
      {
        name: "lunch",
        idx: 3
      }
    ];

    expect(service.parseEventStringListToEventList(eventStrList)).toEqual(eventList);
  });

  it("should create event list from day string when event has parenthesis and multiple inner events", () => {
    const eventStrList = "Breakfast, work, fish (2x 1.5lb, 2x 1lb, dink), lunch";
    const eventList: Event[] = [
      {
        name: "Breakfast",
        idx: 0
      },
      {
        name: "work",
        idx: 1
      },
      {
        name: "fish (2x 1.5lb, 2x 1lb, dink)",
        idx: 2
      },
      {
        name: "lunch",
        idx: 3
      }
    ];

    expect(service.parseEventStringListToEventList(eventStrList)).toEqual(eventList);
  });

  it("should create event list from day string when event has opening paren", () => {
    const eventStrList = "Breakfast, work, sad ;(, lunch";
    const eventList: Event[] = [
      {
        name: "Breakfast",
        idx: 0
      },
      {
        name: "work",
        idx: 1
      },
      {
        name: "sad ;(",
        idx: 2
      },
      {
        name: "lunch",
        idx: 3
      }
    ];

    expect(service.parseEventStringListToEventList(eventStrList)).toEqual(eventList);
  });

  it("should create event list from day string when event has closing paren", () => {
    const eventStrList = "Breakfast, work, happy :), lunch";
    const eventList: Event[] = [
      {
        name: "Breakfast",
        idx: 0
      },
      {
        name: "work",
        idx: 1
      },
      {
        name: "happy :)",
        idx: 2
      },
      {
        name: "lunch",
        idx: 3
      }
    ];

    expect(service.parseEventStringListToEventList(eventStrList)).toEqual(eventList);
  });

  xit("should parse day list text and return list of Day objects", () => {
    const dayText = `
      Sunday- Sleep in, breakfast, walk at Russel Creek, fish (no bites), Kroger, Bubble Bee, code, work on DayTrackr, supper, watch How to Lose a Guy in 10 Days movie, love Mallory, YouTube
      Monday- Breakfast, work, meetings, lunch, nice day, pick up package from office, walk at Arbor hills, fish at Mustang Park (dink), supper, Mallory bake cookies, YouTube, code, homelab, Plex
      Tuesday- Breakfast, work, meetings, lunch, code, walk at Arbor Hills, fish at Mustang Park (1 bite), chat with Christian, supper, Disney, finish Percy Jackson season 1, YouTube
      Wednesday- Breakfast, work, meetings, code, lunch, enjoy weather, longboard, pick up book from Parr library, explore Shady Brook trail, FaceTime Evan, supper, work on DayTrackr, love Mallory, YouTube
      Thursday- Breakfast, work, meetings,code, lunch, install new 12TB HDD (36TB raw now), nap, walk on Shady Brook trail with Mallory, Kroger, supper, Exodus bstud, YouTube, start TV sync to new HDD
      Friday- Breakfast, work, meetings, code, lunch, nap, YouTube, hang with Andrea and Jullian, supper from Thai, codenames, nsync game, chat
      Saturday- Sleep in, waffles for breakfast, make sourdough, code, Plex, lunch, YouTube, walk at Arbor Hills, church, Trader Joe’s, supper, set up ground fort, watch Teenage Kraken movie, start Brothers Hawthorne books, read, fix glasses case, finish TV sync to new HDD (7TB)
      Sunday- Bake sourdough, brunch, read, code, homelab, call home, long walk on Shoreline Trail (6.6mi), supper, VR, YouTube
      Monday- Breakfast, work, meetings, code, lunch, coffee from office, Michael’s, walk at Russell Creek, supper, YouTube, Plex, work on DayTrackr
    `;

    const dayList: Day[] = service.parseDayText(dayText, new Date("2024/01/28"));

    dayList.forEach((day: Day) => {
      const eventStrList: string[] = day.events.map((event: Event) => event.name);
      console.log(day.date, eventStrList);
    });
  });
});
