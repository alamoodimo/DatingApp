import { AccountService } from './account.service';
import { UserParams } from './../_models/UserParams';
import { PaginatedResult } from './../_models/pagination';
import { map, take } from 'rxjs/operators';
import { Member } from './../_models/member';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { environment } from './../../environments/environment';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';

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
  memberCache = new Map();
  userParams: UserParams;
  user: User;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
  }

  getUserParams() {
    return this.userParams;
  }
  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {

    var response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) {
      return of(response);
    }
    // if (this.members.length > 0) return of(this.members);
    console.log(Object.values(userParams).join('-'));
    let params = this.getPagimationHeaders(userParams.pageNumber, userParams.pageSize)
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      }))

  }


  getMember(username: string) {
    // const member = this.members.find(x => x.username === username)
    // if (member !== undefined) return of(member);
    console.log(this.memberCache);
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);
    console.log(member);
    if (member) {
      return of(member);
    }

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {

    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }
  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(predicate: string,pageNumber, pageSize) {


    let params = this.getPagimationHeaders(pageNumber,pageSize)
    params = params.append('predicate', predicate)
    //return this.http.get<Partial<Member[]>>(this.baseUrl + 'likes?predicate=' + predicate);
    return this.getPaginatedResult<Partial<Member[]>>(this.baseUrl+'likes', params);
  }


  private getPaginatedResult<T>(url, params) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })

    );
  }

  private getPagimationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());


    return params;

  }

}
