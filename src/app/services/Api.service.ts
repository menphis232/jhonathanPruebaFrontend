import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  /****************SERVICIOS PARA LAS ORDENES*********************** */

  /**OBTENER TODAS LAS ORDENES */

  getAllOrders(): Observable<any> {
    return this.http.get(`${environment.apiUrl}orders`);
  }

  /** CONSULTAR  UNA ORDEN EN ESPECIFICA */
  getOrder(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}orders/${id}`);
  }

    /** OBTENER ORDENES POR USUARIO ESPECIFICO */
    ordersByUser(id): Observable<any> {
      return this.http.get(`${environment.apiUrl}ordersByUser/${id}`);
    }
  

  /**CREAR UNA ORDEN */
  create(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}orders`, data);
  }

  /**ACTUALIZAR UNA ORDEN */

  updateOrder(data, id): Observable<any> {
    return this.http.put(`${environment.apiUrl}orders/${id}`, data);
  }

  /**BORRAR UNA ORDEN */
  deleteOrder(id): Observable<any> {
    return this.http.delete(`${environment.apiUrl}orders/${id}`);
  }


  /****************SERVICIOS PARA LOS PRODUCTOS*********************** */

  /**OBTENER LOS PRODUCTOS DE UNA ORDEN ESPECIFICA */

  getProductsOrder(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}products/${id}`);
  }

  /** CREAR LOS PRODUCTOS DE LA ORDEN */
  createProducts(data): Observable<any> {
    return this.http.post(`${environment.apiUrl}products`, data);
  }

  /**ACTUALIZAR LOS PRODUCTOS DE LA ORDEN */

  updateProduct(data): Observable<any> {
    return this.http.put(`${environment.apiUrl}products`, data);
  }

/** BORRAR UN PRODUCTO */
  deleteProduct(id): Observable<any> {
    return this.http.delete(`${environment.apiUrl}products/${id}`);
  }

  /** OBTENER TODOS LOS USUARIOS */
  getAllUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}users`);
  }

/** OBTENER DATOS DE  UN SOLO USUARIO */
  showUser(id): Observable<any> {
    return this.http.get(`${environment.apiUrl}users/${id}`);
  }


  

}
