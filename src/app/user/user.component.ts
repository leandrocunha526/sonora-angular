import { Component } from '@angular/core';
import { User } from './Interfaces/User';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  user: User[] = [];
  filteredUser: User[] = [];
  pagedProducts: User[] = [];

  searchTerm: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 5;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.user = data;
        this.applyFilter();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar produtos:', err);
        this.showError('Erro ao carregar produtos.');
      },
    });
  }

  applyFilter(): void {
    this.filteredUser = this.user.filter((user) =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.updatePagedProducts();
  }

  updatePagedProducts(): void {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.filteredUser.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.updatePagedProducts();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  editProduct(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  deleteProduct(user: User): void {
    const confirmDelete = confirm(`Deseja excluir o usuário ${user.name}?`);
    if (confirmDelete) {
      this.userService.delete(user.id).subscribe({
        next: () => {
          this.showSuccess('Produto excluído com sucesso.');
          this.loadProducts();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir produto:', err);
          this.showError('Erro ao excluir produto.');
        },
      });
    }
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 4000,
    });
  }
}
