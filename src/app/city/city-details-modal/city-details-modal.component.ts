import { Component, Inject } from '@angular/core';
import { CityService } from '../city.service';
import { City } from '../interfaces/City';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductDetailsModalComponent } from '../../product/product-details-modal/product-details-modal.component';

@Component({
  selector: 'app-city-details-modal',
  standalone: false,
  templateUrl: './city-details-modal.component.html',
})
export class CityDetailsModalComponent {
  loading = true;
  error = '';
  city!: City;

  constructor(
    private cityService: CityService,
    private dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { }

  ngOnInit(): void {
    this.cityService.findById(this.id).subscribe({
      next: (data) => {
        this.city = data;
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
