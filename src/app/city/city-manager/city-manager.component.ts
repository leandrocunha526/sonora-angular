import { Component } from '@angular/core';
import { City } from '../interfaces/City';
import { CityService } from '../city.service';

@Component({
  selector: 'app-city-manager',
  standalone: false,
  templateUrl: './city-manager.component.html',
  styleUrl: './city-manager.component.scss',
})
export class CityManagerComponent {
  cities: City[] = [];
  filteredCities: City[] = [];
  searchTerm: string = '';
  itemsPerPage = 10;

  displayedColumns: string[] = ['name', 'state', 'actions'];

  constructor(private cityService: CityService) {}

  ngOnInit() {
    this.loadCities();
  }

  loadCities() {
    this.cityService.findAll().subscribe((data) => {
      this.cities = data;
      this.filteredCities = [...this.cities];
    });
  }

  deleteCity(city: City) {
    const confirmDelete = confirm(`Deseja excluir a cidade ${city.name}?`);
    if (confirmDelete) {
      this.cityService.delete(city.id!).subscribe(() => {
        this.loadCities();
      });
    }
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCities = this.cities.filter((city) =>
      city.name.toLowerCase().includes(term)
    );
  }
}
