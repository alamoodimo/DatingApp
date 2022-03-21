import { User } from './../_models/user';
import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, RouterEvent } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// to resolve autocomplete in vs code you have to restart the vs code
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model: any={}

// loggedIn:boolean;
// currentUser$: Observable<User>;
  constructor(public accountService:AccountService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {

   // this.getCurrentUser();
  //  this.currentUser$ = this.accountService.currentUser$;
  }
 login()
 {
  /// console.log(this.model)


   this.accountService.login(this.model).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/members');
    //  this.loggedIn=true;

   }
  //  , 
  //  error => {
  //    console.log(error);
  //    this.toastr.error(error.error);
     
  //  }
   
   );


 }



 logout(){
this.accountService.logout();
  // this.loggedIn=false;
  this.router.navigateByUrl('/');
 }


//  getCurrentUser(){

//   this.accountService.currentUser$.subscribe(user => {
//     this.loggedIn = !!user;
//   }, error => {
//     console.log(error);
//   })
//  }
}
