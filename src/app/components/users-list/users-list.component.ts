import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import swal from 'sweetalert2';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  users=[];


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.apiService.getAllUsers()
      .subscribe(
        data => {
          this.users = data.data;
          console.log(data.data);
        },
        error => {
          console.log(error);
        });
  }




}
