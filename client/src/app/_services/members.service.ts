import { Member } from './../_models/member';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from './../../environments/environment';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';

// const httpOptions = {

//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
//    // Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')||'{}').token
//   })
// }

@Injectable({
  providedIn: 'root'
})
export class MembersService {


  //  httpOptions = {

  //   headers: new HttpHeaders({
  //     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
  //    // Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')||'{}').token
  //   })
  // }
  
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users');

  }
  getMember(username: string){
    return this.http.get<Member>(this.baseUrl+'users/'+username);
  }


}