import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of,from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as Moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})
export class AddOrderComponent implements OnInit {
  Users
  formOrder: FormGroup;
  toEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  formProducts: FormGroup;
  valorTotal=0
  modoEdicion=false
  submitted = false;


  constructor(
    private apiService: ApiService,
    private fb: FormBuilder, 
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.formOrder = this.fb.group({
      idOrder: [null],
      idUser: [null, Validators.required],
      OrderNumber: [null, [Validators.required]],
      DateTime: [null, [Validators.required]],
      ProviderName: [null, [Validators.required]],
      Observation: [null],
      TotalValue: [null],
 
  });
  this.formProducts = this.fb.group({

    products: this.fb.array([])
  });

/**AQUI CARGAMOS LA INFORMACION EN CASO DE  POSEER YA UN ID DE  ORDEN**/
  this.activatedRoute.params
  .pipe(
    switchMap(params => {
      if (params['id']) {
        this.modoEdicion=true
        return this.apiService.getOrder(params['id']);
      } else {
        return of(null);
      }
    })
  )
  .subscribe(data => {
    if (data) {



      this.toEdit$.next(data['data'][0]);
      
      this.formOrder.controls['idOrder'].setValue(data['data'][0]['idOrder']);
      this.formOrder.controls['idUser'].setValue(data['data'][0]['idUser']);
      this.formOrder.controls['OrderNumber'].setValue(data['data'][0]['OrderNumber']);
      this.formOrder.controls['DateTime'].setValue( Moment(data['data'][0]['DateTime']).format('yyyy-MM-DD'));
      this.formOrder.controls['ProviderName'].setValue(data['data'][0]['ProviderName']);
      this.formOrder.controls['Observation'].setValue(data['data'][0]['Observation']);
      this.formOrder.controls['TotalValue'].setValue(data['data'][0]['TotalValue']);



      
    

      /**AQUI CONSULTO LOS PRODUCTOS DE  LA COTIZACION A EDITAR**/

      this.apiService.getProductsOrder(data['data'][0]['idOrder'])
      .subscribe(
        response => {
           console.log(response.data);

                  response.data.forEach(element => {

                  

                    const product = this.fb.group({
                      IdOrdersProducts: new FormControl(element['IdOrdersProducts']),
                      ValueUnit: new FormControl(element['ValueUnit']),
                      Unit: new FormControl(element['Unit']),
                      Description: new FormControl(element['Description']),
                      SKU: new FormControl(element['SKU']),
                      Quantity: new FormControl(element['Quantity']),
                      QtyBox: new FormControl(element['QtyBox']),
                      Weight: new FormControl(element['Weight']),
                      Volumen: new FormControl(element['Volumen']),
                      Mark: new FormControl(element['Mark']),
                      NLote: new FormControl(element['NLote']),
                    

                    });
                  
                    this.products.push(product);

                    product.controls.SKU.disable()

            
                  });
                  this.sumatoria()
         
      
        },
        error => {
          console.log(error);
        });



    }
  });






   }

  ngOnInit(): void {
    this.getUsers()
  }

/**OBTENEMOS LOS ERRORES DEL FORM */
  get f() { return this.formOrder.controls; }

 
/** FUNCION PARA GUARDAR EL FORMULARIO DE  ORDEN**/
  saveOrder(): void {

    this.submitted = true;
    this.apiService.create(this.formOrder.getRawValue())
      .subscribe(
        response => {
          console.log(response.data);

            if(response.data){
              /**SI POSEEMOS PRODUCTOS LOS LLEVAMOS A GUARDAR**/
              if(this.formProducts.value.products.length>0){
                this.apiService.createProducts({products:this.formProducts.value.products,idOrder:response.data})
                .subscribe(
                  response => {
                
                     this.submitted = false;
                     this.router.navigate(['/orders']);
                  },
                  error => {
                    this.submitted = false;
                    console.log(error);
                  });
             
              }
              this.submitted = false;
              this.router.navigate(['/orders']);
              
            }
         
        },
        error => {
          console.log(error);
        });
  }


  /** FUNCION PARA GUARDAR EL FORMULARIO DE  ORDEN**/
  editOrder(): void {

    this.submitted = true;
    this.apiService.updateOrder(this.formOrder.getRawValue(),this.formOrder.controls.idOrder.value)
      .subscribe(
        response => {
          console.log(response.data);

            if(response){
              /**SI POSEEMOS PRODUCTOS LOS LLEVAMOS A EDITARLOS**/
              console.log('esta es la edicion del producto anes',this.formProducts.value.products)
              if(this.formProducts.value.products.length>0){
                console.log('entramos a editar  productos')
                this.apiService.updateProduct({products:this.formProducts.value.products,idOrder:this.formOrder.controls['idOrder'].value})
                .subscribe(
                  response => {
                
                     this.submitted = false;
                     this.router.navigate(['/orders']);
                  },
                  error => {
                    this.submitted = false;
                    console.log(error);
                  });
             
              }
              this.submitted = false;
              this.router.navigate(['/orders']);
              
            }
         
        },
        error => {
          console.log(error);
        });
  }


/** OBTENEMOS TODOS LOS USUARIOS DE NUESTRA BASE DE DATOS **/
  getUsers(){
   
    this.apiService.getAllUsers()
      .subscribe(
        response => {
          // console.log(response);
          this.Users=response.data
      
        },
        error => {
          console.log(error);
        });
  }


/**CAPTURAMOS EL VALOR DE LOS PRODUCTOS**/
  get products(): FormArray {
    return this.formProducts.get('products') as FormArray;
  }

/**FUNCION PARA  IR AGREGANDO LOS PRODUCTOS**/
  agregarProduct() {
    const producto = this.fb.group({
      ValueUnit: new FormControl(),
      Unit: new FormControl(),
      Description: new FormControl(),
      SKU: new FormControl(),
      Quantity: new FormControl(),
      QtyBox: new FormControl(),
      Weight: new FormControl(),
      Volumen: new FormControl(),
      Mark: new FormControl(),
      NLote: new FormControl(),
     
    });
  
    this.products.push(producto);

    // let totalProvicional=this.fb.control(this.ValueUnit.value);

    // this.sumatoria()

    // this.valorTotal.push()
  }
/**FUNCION PARA ELIMINAR LOS PRODUCTOS**/
  deleteProduct(indice: number) {
    this.products.removeAt(indice);
    this.sumatoria()
  }

  /**FUNCION PARA REALIZAR LA SUMATORIA DEL TOTAL **/

  sumatoria(){

 let montoTemporal=0
    this.formProducts.get('products').value.forEach((element,index) => {

      if(element.ValueUnit!=null){
        console.log('entramos',element)
         let montoTemporal2=parseFloat(element.ValueUnit)*parseFloat(element.Quantity)
         console.log('esta seria la suma',montoTemporal+=montoTemporal2)
        
      }

      

     

      
      
    });

    let definitivo=montoTemporal
   
 console.log('esto viene',montoTemporal/2)
    this.formOrder.controls.TotalValue.setValue(definitivo);
    



  }


  deleteProductServer(product: any) {
    console.log('este e sel producto',product.value)
    const confirm = swal.fire({
      title: `Borrar la orden ${product.value.IdOrdersProducts}`,
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
          this.apiService.deleteProduct(product.value.IdOrdersProducts).subscribe({
            next: (response) => {
              if (response) {
          
                this.products.removeAt(product.value.IdOrdersProduct);
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



}


