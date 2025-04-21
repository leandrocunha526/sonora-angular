import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './Interfaces/User';
import { Observable } from 'rxjs/internal/Observable';
import { Profile } from '../profile/interfaces/Profile';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/${user.id}`, user);
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.API_URL}/profile`);
  }
}
