import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CityService } from './city.service';
import { City } from './interfaces/City';
import { State } from './interfaces/State';

@Component({
  selector: 'app-city',
  standalone: false,
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss'
})
export class CityComponent {
  cityForm!: FormGroup;
  states: State[] = [];

  constructor(
    private fb: FormBuilder,
    private cityService: CityService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cityForm = this.fb.group({
      name: ['', Validators.required],
      state: ['', Validators.required],
    });

    this.cityService.getStates().subscribe((data) => (this.states = data));
  }

  onSubmit(): void {
    if (this.cityForm.valid) {
      const city: City = this.cityForm.value;
      this.cityService.add(city).subscribe({
        next: () =>
          this.snackBar.open('Cidade cadastrada com sucesso!', 'Fechar', {
            duration: 3000,
          }),
        error: (err) =>
          this.snackBar.open('Erro: ' + err.error.message, 'Fechar', {
            duration: 3000,
          }),
      });
    }
  }
}
