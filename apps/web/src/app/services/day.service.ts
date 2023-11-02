import { Injectable } from '@angular/core';
import { Observable, of, tap, switchMap } from 'rxjs';
import { Event } from 'src/common/interfaces';
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
    return this.http.get<Day>(`${this.base_url}/daily-events/find/date/${date}`).pipe(
      tap((day: Day) => console.log('Got day by date', day)),
      switchMap((day: Day) => of({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public getDayById(id: string): Observable<Day> {
    return this.http.get<Day>(`${this.base_url}/daily-events/find/date/${id}`).pipe(
      tap((day: Day) => console.log('Got day by ID', day)),
      switchMap((day: Day) => of({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public getTodayOrLatest(): Observable<Day> {
    return this.http.get<Day>(`${this.base_url}/daily-events/find/today`).pipe(
      tap((day: Day) => console.log('Got today or latest', day)),
      switchMap((day: Day) => of({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public getAllDays(): Observable<Day[]> {
    return this.http.get<Day[]>(`${this.base_url}/daily-events/find/all`).pipe(
      tap((list) => console.log('Retrieved all days', list)),
      // Sorting events by index ASC
      switchMap((list: Day[]) => of(list.map((day: Day) => ({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))))
    );
  }

  public getDaysBetween(date1: Date, date2: Date): Observable<Day[]> {
    const dateStr1: string = this.datePipe.transform(date1, 'yyyy-MM-dd') ?? '';
    const dateStr2: string = this.datePipe.transform(date2, 'yyyy-MM-dd') ?? '';

    return this.http.get<Day[]>(`${this.base_url}/daily-events/find/between?date1=${dateStr1}&date2=${dateStr2}`).pipe(
      tap((list) => console.log(`Retrieved ${list.length} days beetween ${dateStr1} and ${dateStr2}`, list)),
      // Sorting events by index ASC
      switchMap((list: Day[]) => of(list.map((day: Day) => ({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))))
    );
  }

  public saveDay(newDay: Day): Observable<Day> {
    console.log("Saving day", newDay);
    return this.http.post<Day>(`${this.base_url}/daily-events/save`, newDay).pipe(
      tap((day: Day) => console.log('Saved day', day)),
      switchMap((day: Day) => of({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))
    );
  }

  public saveMulti(days: Day[]): Observable<Day[]> {
    return this.http.post<Day[]>(`${this.base_url}/daily-events/save/multi`, days).pipe(
      tap((data) => console.log('Saved days!', data)),
      switchMap((list: Day[]) => of(list.map((day: Day) => ({ ...day, events: day.events.sort((curr: Event, prev: Event) => curr.idx - prev.idx) }))))
    );
  }

  public deleteById(id: string): Observable<any> {
    return this.http.delete(`${this.base_url}/daily-events/delete/${id}`);
  }
}
