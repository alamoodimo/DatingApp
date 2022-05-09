import { map } from 'rxjs/operators';
import { Member } from './../_models/member';
import { Observable, of } from 'rxjs';
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

  members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers() {
    if (this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    );

  }
  getMember(username: string) {
    const member = this.members.find(x => x.username=== username)
    if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {

    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index]=member;
      })
    );
  }


}
