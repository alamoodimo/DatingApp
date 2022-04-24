import { Member } from './../../_models/member';
import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
members: Member[];


  constructor(private memberService:MembersService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.getMembers().subscribe(members => {
      
      this.members=members;
     // console.log('from api : '+members);

      //console.log('from this.memebers : '+this.members);
    
    })
  }

}
