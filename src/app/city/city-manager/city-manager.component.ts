import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { City } from '../interfaces/City';
import { CityService } from '../city.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-city-manager',
  standalone: false,
  templateUrl: './city-manager.component.html',
  styleUrl: './city-manager.component.scss',
})
export class CityManagerComponent {
  cities: City[] = [];
  filteredCities: City[] = [];
  pagedCities: City[] = [];
  searchTerm: string = '';
  itemsPerPage = 5;
  pageIndex = 0;

  constructor(
    private cityService: CityService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.cityService.findAll().subscribe((data) => {
      this.cities = data;
      this.applyFilterAndPagination();
    });
  }

  deleteCity(city: City) {
    const confirmDelete = confirm(`Deseja excluir a cidade ${city.name}?`);
    if (confirmDelete) {
      this.cityService.delete(city.id!).subscribe({
        next: () => {
          this.snackBar.open('Cidade excluída com sucesso!', 'Fechar', {
            duration: 3000,
          });
          this.loadCities();
        },
        error: (err) => {
          if (err.status === 500) {
            this.snackBar.open('Não é possível excluir a cidade, pois há produtos associados.', 'Fechar', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('Erro ao excluir a cidade. Tente novamente.', 'Fechar', {
              duration: 3000,
            });
          }
        }
      });
    }
  }
  onSearch() {
    this.pageIndex = 0;
    this.applyFilterAndPagination();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePagedCities();
  }

  applyFilterAndPagination() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCities = this.cities.filter((city) =>
      city.name.toLowerCase().includes(term)
    );
    this.updatePagedCities();
  }

  updatePagedCities() {
    const startIndex = this.pageIndex * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCities = this.filteredCities.slice(startIndex, endIndex);
  }

  editCity(city: City): void {
    this.router.navigate(['/products/edit', city.id]);
  }
}
