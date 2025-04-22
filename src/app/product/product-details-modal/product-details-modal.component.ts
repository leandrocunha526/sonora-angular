import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/Product';

@Component({
  selector: 'app-product-details-modal',
  standalone: false,
  templateUrl: './product-details-modal.component.html'
})
export class ProductDetailsModalComponent {
  loading = true;
  error = '';
  product!: Product;

  constructor(
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { }

  ngOnInit(): void {
    this.productService.getById(this.id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar o produto.';
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
