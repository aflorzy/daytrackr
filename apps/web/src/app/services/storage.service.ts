import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  public setItemInStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItemFromStorage(key: string): any {
    const item: string | null = localStorage.getItem(key);
    if (item === null || item == undefined) return;
    return JSON.parse(item);
  }

  public removeItemFromStorage(key: string) {
    localStorage.removeItem(key);
  }
}
