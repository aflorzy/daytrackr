import { Injectable } from "@angular/core";
import { StorageKey } from "../constants";

@Injectable({
  providedIn: "root"
})
export class StorageService {
  public setItemInStorage(key: StorageKey, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getItemFromStorage<T>(key: StorageKey): T {
    const item: string | null = localStorage.getItem(key);
    if (item === null || item === undefined) return <T>undefined;

    return <T>JSON.parse(item);
  }

  public removeItemFromStorage(key: StorageKey) {
    localStorage.removeItem(key);
  }
}
