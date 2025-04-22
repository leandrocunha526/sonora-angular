import { Component, Inject } from '@angular/core';
import { User } from '../Interfaces/User';
import { UserService } from '../user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductDetailsModalComponent } from '../../product/product-details-modal/product-details-modal.component';

@Component({
  selector: 'app-user-details-modal',
  standalone: false,
  templateUrl: './user-details-modal.component.html',
})
export class UserDetailsModalComponent {
  loading = true;
  error = '';
  user!: User;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public id: number
  ) { }

  ngOnInit(): void {
    this.userService.getById(this.id).subscribe({
      next: (data) => {
        this.user = data;
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
