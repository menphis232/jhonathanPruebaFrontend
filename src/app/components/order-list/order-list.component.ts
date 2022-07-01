import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import swal from 'sweetalert2';
import { BehaviorSubject, from, Observable } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  orders=[];
  currentTutorial = null;
  currentIndex = -1;
  title = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getOrders();
  
  }

  getOrders(): void {
    this.apiService.getAllOrders()
      .subscribe(
        data => {
          this.orders = data.data;
         
          this.promedioOrdenes();
        },
        error => {
          console.log(error);
        });
  }

  


  delete(order: any) {
    const confirm = swal.fire({
      title: `Borrar la orden ${order.idOrder}`,
      text: 'Esta acción no se puede deshacer',
      // type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar Orden',
      focusCancel: true,
      cancelButtonColor: '#8CD4F5',
    });

    from(confirm).subscribe({
      next: (r) => {
        if (r['value']) {
          this.apiService.deleteOrder(order.idOrder).subscribe({
            next: (response) => {
              if (response) {
 
                this.getOrders();
              } else {

              }
            },
            error: (e) => console.log(e),
          });
        }
      },
      error: (e) =>  console.log(e),
    });
  }


  promedioOrdenes(){

    this.orders.forEach((element,index) => {
      console.log('ordenes',element)
      let sumProducto=0;
      let sumProducto2=0;
      let total
      this.apiService.getProductsOrder(element.idOrder)
      .subscribe(
        productos => {

          productos.data.forEach((producto,indexProd) => {

            console.log('productos',producto)
             sumProducto2 += producto.ValueUnit;

             sumProducto++;
            //  sumProducto+=sumProducto2

            
             console.log('temporal',sumProducto2)
            

          });
        
          total=sumProducto2
        
          console.log('total prod',sumProducto)
          let totalProducto=sumProducto
          sumProducto=0;
          // 
          this.orders[index]['sumatoria']=total/totalProducto
          sumProducto2=0;
        });
 
        
 

          console.log('ordenes', this.orders)
      
    });



  }

}
