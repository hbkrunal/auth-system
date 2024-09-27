import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // Store a string value
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // Retrieve a string value
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Store an object
  setObject(key: string, obj: any): void {
    localStorage.setItem(key, JSON.stringify(obj));
  }

  // Retrieve an object
  getObject(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Remove a specific item
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all items
  clear(): void {
    localStorage.clear();
  }
}
