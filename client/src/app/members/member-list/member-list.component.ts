import { User } from 'src/app/_models/user';
import { AccountService } from './../../_services/account.service';
import { UserParams } from './../../_models/UserParams';
import { Observable } from 'rxjs';
import { Member } from './../../_models/member';
import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';
import { Pagination } from 'src/app/_models/pagination';
import { first, take } from 'rxjs/operators';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
members: Member[];
pagination: Pagination;
// pageNumber= 1;
// pageSize=5;
//members$: Observable<Member[]>;
userParams: UserParams;
user: User;
genderList=[{value:'male', display: 'Males'},{value:'female', display: 'Females'}]

  constructor(private memberService:MembersService) { 

    //to use  (take(1))  we have to import import { take } from 'rxjs/operators' in the component
    // // this.accountService.currentUser$.pipe(take(1)).subscribe(user => { --> moved to memberService and delete accountService from this constructor
    // //   this.user = user;
    // //   this.userParams= new UserParams(user);
    // // })
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {

    // this.members$=this.memberService.getMembers();
   this.loadMembers();
  }


  loadMembers(){
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members=response.result;
      this.pagination= response.pagination;
    })
  }
  // loadMembers(){
  //   this.memberService.getMembers().subscribe(members => {
      
  //     this.members=members;
  //    // console.log('from api : '+members);

  //     //console.log('from this.memebers : '+this.members);
    
  //   })
  // }


  resetFilters(){
    //this.userParams = new UserParams(this.user);
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any)
  {
this.userParams.pageNumber = event.page;
this.memberService.setUserParams(this.userParams);
this.loadMembers();
  }
}
