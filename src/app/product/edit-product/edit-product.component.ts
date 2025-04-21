import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from '../../city/city.service';
import { City } from '../../city/interfaces/City';
import { ProductService } from '../product.service';
import { Product } from '../interfaces/Product';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {
  productForm!: FormGroup;
  cities: City[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cityService: CityService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.cityService.findAll().subscribe((cities) => {
      this.cities = cities;
    });

    // Carregar produto a editar
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe((product) => {
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        stock: product.stock,
        cityId: product.cityId
      });
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      cityId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const formValue = this.productForm.value;

    const product: Product = {
      id,
      name: formValue.name,
      price: formValue.price,
      stock: formValue.stock,
      cityId: formValue.cityId,
    };

    this.productService.update(id, product).subscribe({
      next: () => {
        this.snackBar.open('Produto atualizado com sucesso!', 'Fechar', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackBar.open('Erro: ' + err.error.message, 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

}
