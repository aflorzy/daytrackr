import { Injectable } from '@angular/core';
import { Observable, of, tap, switchMap } from 'rxjs';
import { Event, ResponseMessageDailyEvent } from 'src/common/interfaces';
import { Day } from 'src/common/interfaces';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DayService {
  day!: Day;
  days: Day[];
  private base_url: string = environment.baseUrl;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    const days = localStorage.getItem('days') || '[]';
    this.days = JSON.parse(days);
  }

  public getDayByDate(date: Date): Observable<Day> {
    return this.http.get<ResponseMessageDailyEvent>(`${this.base_url}/daily-events/find/date/${date}`).pipe(
      tap((response: ResponseMessageDailyEvent) => console.log('Got day by date', response.dailyEvent)),
      switchMap((response: ResponseMessageDailyEvent) => of({ ...response.dailyEvent, events: response.dailyEvent.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public getDayById(id: string): Observable<Day> {
    return this.http.get<ResponseMessageDailyEvent>(`${this.base_url}/daily-events/find/date/${id}`).pipe(
      tap((response: ResponseMessageDailyEvent) => console.log('Got day by ID', response.dailyEvent)),
      switchMap((response: ResponseMessageDailyEvent) => of({ ...response.dailyEvent, events: response.dailyEvent.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public getTodayOrLatest(): Observable<Day> {
    return this.http.get<ResponseMessageDailyEvent>(`${this.base_url}/daily-events/find/today`).pipe(
      tap((response: ResponseMessageDailyEvent) => console.log('Got today or latest', response.dailyEvent)),
      switchMap((response: ResponseMessageDailyEvent) => of({ ...response.dailyEvent, events: response.dailyEvent.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public getAllDays(): Observable<Day[]> {
    return this.http.get<ResponseMessageDailyEvent>(`${this.base_url}/daily-events/find/all`).pipe(
      tap((response: ResponseMessageDailyEvent) => console.log('Retrieved all days', response.dailyEventList)),
      // Sorting events by index ASC
      switchMap((response: ResponseMessageDailyEvent) => of(response.dailyEventList.map((day: Day) => ({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))))
    );
  }

  public getDaysBetween(date1: Date, date2: Date): Observable<Day[]> {
    const dateStr1: string = this.datePipe.transform(date1, 'yyyy-MM-dd') ?? '';
    const dateStr2: string = this.datePipe.transform(date2, 'yyyy-MM-dd') ?? '';

    return this.http.get<ResponseMessageDailyEvent>(`${this.base_url}/daily-events/find/between?date1=${dateStr1}&date2=${dateStr2}`).pipe(
      tap((response: ResponseMessageDailyEvent) => console.log(`Retrieved ${response.dailyEventList.length} days beetween ${dateStr1} and ${dateStr2}`, response.dailyEventList)),
      // Sorting events by index ASC
      switchMap((response: ResponseMessageDailyEvent) => of(response.dailyEventList.map((day: Day) => ({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))))
    );
  }

  public saveDay(newDay: Day): Observable<Day> {
    return this.http.post<ResponseMessageDailyEvent>(`${this.base_url}/daily-events/save`, newDay).pipe(
      tap((response: ResponseMessageDailyEvent) => console.log('Saved day', response.dailyEvent)),
      switchMap((response: ResponseMessageDailyEvent) => of({ ...response.dailyEvent, events: response.dailyEvent.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public saveMulti(days: Day[]): Observable<Day[]> {
    return this.http.post<ResponseMessageDailyEvent>(`${this.base_url}/daily-events/save/multi`, days).pipe(
      tap((response: ResponseMessageDailyEvent) => console.log('Saved days!', response.dailyEventList)),
      switchMap((response: ResponseMessageDailyEvent) => of(response.dailyEventList.map((day: Day) => ({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))))
    );
  }

  public deleteById(id: string): Observable<any> {
    return this.http.delete(`${this.base_url}/daily-events/delete/${id}`);
  }
}
