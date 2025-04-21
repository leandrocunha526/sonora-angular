import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from './interfaces/City';
import { State } from './interfaces/State';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private API_URL = 'http://localhost:8080/cities';

  constructor(private http: HttpClient) { }

  add(city: City): Observable<City> {
    return this.http.post<City>(`${this.API_URL}`, city);
  }

  findAll(): Observable<City[]> {
    return this.http.get<City[]>(`${this.API_URL}`);
  }

  getStates(): Observable<State[]> {
    return this.http.get<State[]>(`${this.API_URL}/states`);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  findById(id: number): Observable<City> {
    return this.http.get<City>(`${this.API_URL}/${id}`);
  }

  update(id: number, city: City): Observable<City> {
    return this.http.put<City>(`${this.API_URL}/${id}`, city);
  }

  findByName(name: string): Observable<City[]> {
    return this.http.get<City[]>(`${this.API_URL}/search`, { params: { name } });
  }
}
