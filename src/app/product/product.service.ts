import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './interfaces/Product'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL = 'http://localhost:8080/products';

  constructor(private http: HttpClient) { }

  /**
   * Obtém todos os produtos cadastrados
   */
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL);
  }

  /**
   * Obtém um produto pelo ID
   * @param id ID do produto
   */
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`);
  }

  /**
   * Adiciona um novo produto
   * @param product Produto a ser adicionado
   */
  add(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  /**
   * Atualiza um produto existente
   * @param id ID do produto a ser atualizado
   * @param product Dados atualizados do produto
   */
  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, product);
  }

  /**
   * Deleta um produto pelo ID
   * @param id ID do produto a ser deletado
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Obtém produtos por cidade
   * @param cityId ID da cidade
   */
  getCities(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/cities');
  }
}
