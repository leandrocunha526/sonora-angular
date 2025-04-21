import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../user.service';
import { User } from '../Interfaces/User';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  standalone: false,
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm!: FormGroup;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      username: ['', [Validators.required, Validators.maxLength(100)]],
      cpf: ['', [Validators.required]],
      role: ['', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getById(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          username: user.username,
          cpf: user.cpf,
          role: user.role,
        });
      },
      error: () => {
        this.snackBar.open('Erro ao carregar usuário.', 'Fechar', { duration: 3000 });
      }
    });
  }

  onUpdate(): void {
    if (this.userForm.invalid) return;

    const updatedUser: User = {
      id: this.userId,
      ...this.userForm.value,
      cpf: this.userForm.value.cpf.replace(/\D/g, '') // remove máscara
    };

    if (this.userForm.value.password) {
      updatedUser.password = this.userForm.value.password;
    }

    this.userService.update(updatedUser).subscribe({
      next: () => {
        this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Erro ao atualizar usuário.', 'Fechar', { duration: 3000 });
        console.error('Erro ao atualizar usuário:', error);
      }
    });
  }

  onCancel(): void {
    this.userForm.reset();
    this.snackBar.open('Edição cancelada', 'Fechar', { duration: 3000 });
  }
}
