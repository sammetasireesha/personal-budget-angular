import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cachedData: any[] | undefined;

  constructor(private http: HttpClient) {}

  getData(): Observable<any[]> {
    if (this.cachedData !== undefined) {
      // If data is already cached, return it as an observable
      return of(this.cachedData);
    } else {
      // If data is not cached, make an HTTP request to fetch it
      return this.http.get<any[]>('http://localhost:3000/budget01').pipe(
        // Cache the data when it's fetched
        tap((data) => {
          this.cachedData = data;
        })
      );
    }
  }
}
