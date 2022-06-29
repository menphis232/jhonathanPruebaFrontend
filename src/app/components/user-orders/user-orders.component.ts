import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of,from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as Moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {

  User
  
  Orders=[]


  constructor(
    private apiService: ApiService,
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private router: Router) {



/**AQUI CARGAMOS LA INFORMACION DEL USUARIO**/
  this.activatedRoute.params
  .pipe(
    switchMap(params => {
      if (params['id']) {
   
        return this.apiService.showUser(params['id']);
      } else {
        return of(null);
      }
    })
  )
  .subscribe(data => {
    if (data) {
      this.User=data['data'][0];
     

      /**AQUI CONSULTO LAS ORDENES DEL USUARIO**/

      this.apiService.ordersByUser(data['data'][0]['IdUser'])
      .subscribe(
        response => {
           console.log(response.data);

           this.Orders=response.data 
         
      
        },
        error => {
          console.log(error);
        });



    }
  });






   }

  ngOnInit(): void {
  
  }









}
