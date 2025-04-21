import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from './interfaces/Profile';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profile: Profile | null = null;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (err) => {
        console.error('Erro ao carregar perfil', err);
        this.snackBar.open('Erro ao carregar perfil', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
}
