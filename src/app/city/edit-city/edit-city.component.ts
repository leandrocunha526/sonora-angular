import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CityService } from '../city.service';
import { State } from '../interfaces/State';

@Component({
  selector: 'app-edit-city',
  standalone: false,
  templateUrl: './edit-city.component.html',
  styleUrl: './edit-city.component.scss'
})
export class EditCityComponent {
  cityForm!: FormGroup;
  states: State[] = [];
  cityId!: number;

  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', Validators.required]
    });

    this.cityId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStates();
    this.loadCity();
  }

  loadStates(): void {
    this.cityService.getStates().subscribe({
      next: (states) => {
        this.states = states;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar estados.', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadCity(): void {
    this.cityService.findById(this.cityId).subscribe({
      next: (city) => {
        this.cityForm.patchValue({
          name: city.name,
          state: city.state
        });
      },
      error: () => {
        this.snackBar.open('Erro ao carregar cidade.', 'Fechar', { duration: 3000 });
      }
    });
  }

  onUpdate(): void {
    if (this.cityForm.invalid) return;

    const updatedCity = this.cityForm.value;

    this.cityService.update(this.cityId, updatedCity).subscribe({
      next: () => {
        this.snackBar.open('Cidade atualizada com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erro ao atualizar cidade.', 'Fechar', { duration: 3000 });
        console.error('Erro ao atualizar cidade:', error);
      }
    });
  }
}
