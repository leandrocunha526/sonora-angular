import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { Product } from '../product/interfaces/Product';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];

  searchTerm: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 5;

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilter();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar produtos:', err);
        this.showError('Erro ao carregar produtos.');
      },
    });
  }

  applyFilter(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.updatePagedProducts();
  }

  updatePagedProducts(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePagedProducts();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  editProduct(product: Product): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  deleteProduct(product: Product): void {
    this.productService.delete(product.id).subscribe({
      next: () => {
        this.showSuccess('Produto excluído com sucesso.');
        this.loadProducts();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao excluir produto:', err);
        this.showError('Erro ao excluir produto.');
      },
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
      panelClass: ['error-snackbar'],
    });
  }
}
