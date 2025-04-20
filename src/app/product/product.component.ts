import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './product.service';
import { Product } from './interfaces/Product';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  cities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar  // Injetando o MatSnackBar
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      cityId: [null, Validators.required]
    });

    this.productService.getCities().subscribe(data => this.cities = data);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      this.productService.add(product).subscribe({
        next: () => {
          this.snackBar.open('Produto salvo com sucesso!', 'Fechar', {
            duration: 3000, // A duração do snack bar em milissegundos
            panelClass: ['success-snackbar'] // Classe opcional para customizar o estilo
          });
        },
        error: err => {
          this.snackBar.open('Erro ao salvar: ' + err.error.message, 'Fechar', {
            duration: 3000, // A duração do snack bar em milissegundos
            panelClass: ['error-snackbar'] // Classe opcional para customizar o estilo
          });
        }
      });
    }
  }
}
