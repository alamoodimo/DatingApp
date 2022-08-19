import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/_services/members.service';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],

})
export class MemberCardComponent implements OnInit {
  @Input() member: Member;
  constructor(private memberService: MembersService,
     private toastr: ToastrService
     , public presence: PresenceService) { }

  ngOnInit(): void {
    this.memberIsLoaded();

  }
  memberIsLoaded() {
    console.log('child comp' + this.member);
  }

  addLike(member: Member){
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('You have liked' + member.knownAs);
    })
  }

  




}
