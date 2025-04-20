import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from './interfaces/City';
import { State } from './interfaces/State';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private API_URL = 'http://localhost:8080/cities';

  constructor(private http: HttpClient) { }

  add(city: City): Observable<City> {
    return this.http.post<City>(`${this.API_URL}`, city);
  }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.API_URL}/states`);
  }
}
