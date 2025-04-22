import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { City } from '../interfaces/City';
import { CityService } from '../city.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CityDetailsModalComponent } from '../city-details-modal/city-details-modal.component';

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
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadCities();
  }

  onSearch(name: string): void {
    this.searchTerm = name;

    if (!name.trim()) {
      this.loadCities(); // se o campo foi limpo, recarrega tudo
      return;
    }

    this.cityService.findByName(name).subscribe({
      next: (data) => {
        this.cities = data;
        this.pageIndex = 0; // resetar página
        this.applyFilterAndPagination();
      },
      error: (err) => {
        this.snackBar.open('Erro ao buscar cidades: ' + err.error.message, 'Fechar', {
          duration: 3000,
        });
      },
    });
  }


  loadCities() {
    this.cityService.findAll().subscribe((data) => {
      this.cities = data;
      this.pageIndex = 0;
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
    this.router.navigate(['/cities/edit', city.id]);
  }

  openProductDetails(cityId: number): void {
    this.dialog.open(CityDetailsModalComponent, {
      width: '400px',
      data: cityId
    });
  }
}
